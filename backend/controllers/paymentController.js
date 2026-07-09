import db from "../config/db.js";

const sendError = (res, message, err, status = 500) => {
  if (err) {
    console.log(message, err);
  }

  return res.status(status).json({
    success: false,
    message,
  });
};

const toAmount = (value) => Number(value || 0);

const validateRequired = (fields) =>
  Object.entries(fields).find(([, value]) => value === undefined || value === null || value === "");

const normalizeDate = (value) => {
  const raw = String(value || "").trim();
  let year;
  let month;
  let day;

  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const localMatch = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);

  if (isoMatch) {
    [, year, month, day] = isoMatch;
  } else if (localMatch) {
    [, day, month, year] = localMatch;
    day = day.padStart(2, "0");
    month = month.padStart(2, "0");
  } else {
    return null;
  }

  const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() + 1 !== Number(month) ||
    date.getUTCDate() !== Number(day)
  ) {
    return null;
  }

  return `${year}-${month}-${day}`;
};

const validateAmount = (amount) => Number.isFinite(Number(amount)) && Number(amount) > 0;

const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const beginTransaction = () =>
  new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const commit = () =>
  new Promise((resolve, reject) => {
    db.commit((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const rollback = () =>
  new Promise((resolve) => {
    db.rollback(() => resolve());
  });

const addColumnIfMissing = async (sql, label) => {
  try {
    await query(sql);
  } catch (err) {
    if (err.code !== "ER_DUP_FIELDNAME") {
      console.log(`${label} setup failed`, err);
      throw err;
    }
  }
};

const paymentSchemaReady = (async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT NULL,
      customer_name VARCHAR(120),
      amount DECIMAL(12, 2) NOT NULL,
      previous_balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
      current_balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
      payment_date DATE NOT NULL,
      payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash',
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await addColumnIfMissing("ALTER TABLE customers ADD COLUMN current_balance DECIMAL(12, 2) NOT NULL DEFAULT 0", "Customer balance column");
  await addColumnIfMissing("ALTER TABLE payments ADD COLUMN customer_id INT NULL", "Payment customer_id column");
  await addColumnIfMissing("ALTER TABLE payments ADD COLUMN customer_name VARCHAR(120)", "Payment customer name column");
  await addColumnIfMissing(
    "ALTER TABLE payments ADD COLUMN previous_balance DECIMAL(12, 2) NOT NULL DEFAULT 0",
    "Payment previous balance column"
  );
  await addColumnIfMissing(
    "ALTER TABLE payments ADD COLUMN current_balance DECIMAL(12, 2) NOT NULL DEFAULT 0",
    "Payment current balance column"
  );
  await addColumnIfMissing("ALTER TABLE payments ADD COLUMN payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash'", "Payment method column");

  await query(`
    UPDATE customers
    SET current_balance = COALESCE(NULLIF(current_balance, 0), opening_balance, 0)
    WHERE current_balance = 0 AND COALESCE(opening_balance, 0) > 0
  `);

  await query(`
    UPDATE payments p
    JOIN customers c ON c.id = p.customer_id
    SET p.customer_name = c.customer_name
    WHERE p.customer_name IS NULL OR p.customer_name = ''
  `);
})();

const getCustomerForUpdate = async (customerId) => {
  const rows = await query(
    "SELECT id, customer_name, opening_balance, current_balance FROM customers WHERE id = ? FOR UPDATE",
    [customerId]
  );

  return rows[0];
};

const mapPaymentPayload = (body) => {
  const customerId = body.customer_id || body.customerId;
  const paymentMethod = body.payment_method || body.paymentMode || "Cash";

  return {
    customerId,
    amount: body.amount,
    paymentDate: body.payment_date || body.date,
    paymentMethod,
    note: body.note || "",
  };
};

export const getPaymentCustomers = async (req, res) => {
  try {
    await paymentSchemaReady;

    const rows = await query(`
      SELECT
        id,
        customer_name,
        mobile,
        opening_balance,
        current_balance
      FROM customers
      ORDER BY customer_name ASC
    `);

    res.status(200).json(rows);
  } catch (err) {
    sendError(res, "Customer Fetch Failed", err);
  }
};

export const getPayments = async (req, res) => {
  try {
    await paymentSchemaReady;

    const rows = await query(`
      SELECT
        p.*,
        c.mobile,
        COALESCE(c.current_balance, p.current_balance) AS live_balance
      FROM payments p
      LEFT JOIN customers c ON c.id = p.customer_id
      ORDER BY p.payment_date DESC, p.id DESC
    `);

    res.status(200).json(rows);
  } catch (err) {
    sendError(res, "Payment Fetch Failed", err);
  }
};

export const addPayment = async (req, res) => {
  await paymentSchemaReady;

  const { customerId, amount, paymentDate, paymentMethod, note } = mapPaymentPayload(req.body);
  const missing = validateRequired({ customer_id: customerId, amount, payment_date: paymentDate, payment_method: paymentMethod });
  const normalizedPaymentDate = normalizeDate(paymentDate);

  if (missing) {
    return sendError(res, `${missing[0]} is required`, null, 400);
  }

  if (!validateAmount(amount)) {
    return sendError(res, "amount must be greater than 0", null, 400);
  }

  if (!normalizedPaymentDate) {
    return sendError(res, "payment_date must be a valid date", null, 400);
  }

  try {
    await beginTransaction();

    const customer = await getCustomerForUpdate(customerId);

    if (!customer) {
      await rollback();
      return sendError(res, "Customer not found", null, 404);
    }

    const paymentAmount = toAmount(amount);
    const previousBalance = toAmount(customer.current_balance);
    const currentBalance = Math.max(previousBalance - paymentAmount, 0);

    const result = await query(
      `
        INSERT INTO payments
        (customer_id, customer_name, amount, previous_balance, current_balance, payment_date, payment_method, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        customer.id,
        customer.customer_name,
        paymentAmount,
        previousBalance,
        currentBalance,
        normalizedPaymentDate,
        paymentMethod,
        note,
      ]
    );

    await query("UPDATE customers SET current_balance = ? WHERE id = ?", [currentBalance, customer.id]);
    await commit();

    res.status(201).json({
      success: true,
      message: "Payment Added Successfully",
      id: result.insertId,
      previous_balance: previousBalance,
      current_balance: currentBalance,
    });
  } catch (err) {
    await rollback();
    sendError(res, "Payment Save Failed", err);
  }
};

export const updatePayment = async (req, res) => {
  await paymentSchemaReady;

  const { id } = req.params;
  const { customerId, amount, paymentDate, paymentMethod, note } = mapPaymentPayload(req.body);
  const missing = validateRequired({ customer_id: customerId, amount, payment_date: paymentDate, payment_method: paymentMethod });
  const normalizedPaymentDate = normalizeDate(paymentDate);

  if (missing) {
    return sendError(res, `${missing[0]} is required`, null, 400);
  }

  if (!validateAmount(amount)) {
    return sendError(res, "amount must be greater than 0", null, 400);
  }

  if (!normalizedPaymentDate) {
    return sendError(res, "payment_date must be a valid date", null, 400);
  }

  try {
    await beginTransaction();

    const existingRows = await query("SELECT * FROM payments WHERE id = ? FOR UPDATE", [id]);
    const existing = existingRows[0];

    if (!existing) {
      await rollback();
      return sendError(res, "Payment not found", null, 404);
    }

    if (existing.customer_id) {
      await query("UPDATE customers SET current_balance = current_balance + ? WHERE id = ?", [
        existing.amount,
        existing.customer_id,
      ]);
    }

    const customer = await getCustomerForUpdate(customerId);

    if (!customer) {
      await rollback();
      return sendError(res, "Customer not found", null, 404);
    }

    const paymentAmount = toAmount(amount);
    const previousBalance = toAmount(customer.current_balance);
    const currentBalance = Math.max(previousBalance - paymentAmount, 0);

    await query(
      `
        UPDATE payments
        SET customer_id = ?,
            customer_name = ?,
            amount = ?,
            previous_balance = ?,
            current_balance = ?,
            payment_date = ?,
            payment_method = ?,
            note = ?
        WHERE id = ?
      `,
      [
        customer.id,
        customer.customer_name,
        paymentAmount,
        previousBalance,
        currentBalance,
        normalizedPaymentDate,
        paymentMethod,
        note,
        id,
      ]
    );

    await query("UPDATE customers SET current_balance = ? WHERE id = ?", [currentBalance, customer.id]);
    await commit();

    res.status(200).json({
      success: true,
      message: "Payment Updated Successfully",
      previous_balance: previousBalance,
      current_balance: currentBalance,
    });
  } catch (err) {
    await rollback();
    sendError(res, "Payment Update Failed", err);
  }
};

export const deletePayment = async (req, res) => {
  await paymentSchemaReady;

  const { id } = req.params;

  try {
    await beginTransaction();

    const rows = await query("SELECT * FROM payments WHERE id = ? FOR UPDATE", [id]);
    const payment = rows[0];

    if (!payment) {
      await rollback();
      return sendError(res, "Payment not found", null, 404);
    }

    if (payment.customer_id) {
      await query("UPDATE customers SET current_balance = current_balance + ? WHERE id = ?", [
        payment.amount,
        payment.customer_id,
      ]);
    }

    await query("DELETE FROM payments WHERE id = ?", [id]);
    await commit();

    res.status(200).json({
      success: true,
      message: "Payment Deleted Successfully",
    });
  } catch (err) {
    await rollback();
    sendError(res, "Payment Delete Failed", err);
  }
};

export const getPaymentSummary = async (req, res) => {
  try {
    await paymentSchemaReady;

    const [summaryRows, trendRows, topRows, recentRows] = await Promise.all([
      query(`
        SELECT
          COUNT(*) AS total_payments,
          COALESCE(SUM(amount), 0) AS total_collection,
          COALESCE(SUM(CASE WHEN payment_date = CURDATE() THEN amount ELSE 0 END), 0) AS today_collection
        FROM payments
      `),
      query(`
        SELECT
          dates.payment_date,
          COALESCE(SUM(p.amount), 0) AS amount
        FROM (
          SELECT CURDATE() AS payment_date
          UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 1 DAY)
          UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 2 DAY)
          UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 3 DAY)
          UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 4 DAY)
          UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 5 DAY)
          UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        ) dates
        LEFT JOIN payments p ON p.payment_date = dates.payment_date
        GROUP BY dates.payment_date
        ORDER BY dates.payment_date ASC
      `),
      query(`
        SELECT
          customer_id,
          customer_name,
          COUNT(*) AS payment_count,
          COALESCE(SUM(amount), 0) AS total_paid
        FROM payments
        GROUP BY customer_id, customer_name
        ORDER BY total_paid DESC
        LIMIT 5
      `),
      query(`
        SELECT *
        FROM payments
        ORDER BY payment_date DESC, id DESC
        LIMIT 5
      `),
    ]);

    const pendingRows = await query("SELECT COALESCE(SUM(current_balance), 0) AS pending_recovery FROM customers");
    const summary = summaryRows[0] || {};

    res.status(200).json({
      total_collection: toAmount(summary.total_collection),
      today_collection: toAmount(summary.today_collection),
      pending_recovery: toAmount(pendingRows[0]?.pending_recovery),
      total_payments: Number(summary.total_payments || 0),
      trend: trendRows.map((row) => ({
        payment_date: row.payment_date,
        amount: toAmount(row.amount),
      })),
      top_customers: topRows.map((row) => ({
        ...row,
        total_paid: toAmount(row.total_paid),
        payment_count: Number(row.payment_count || 0),
      })),
      recent_payments: recentRows,
    });
  } catch (err) {
    sendError(res, "Payment Summary Fetch Failed", err);
  }
};
