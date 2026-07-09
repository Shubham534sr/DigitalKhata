import db from "../config/db.js";

const toAmount = (value) => Number(value || 0);

const sendError = (res, message, err, status = 500) => {
  if (err) {
    console.log(message, err);
  }

  return res.status(status).json({
    success: false,
    message,
  });
};

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

db.query(`
  CREATE TABLE IF NOT EXISTS supplier_purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(120) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    bill_no VARCHAR(80) NOT NULL,
    purchase_date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

db.query(`
  CREATE TABLE IF NOT EXISTS customer_credits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(120) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    credit_date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

export const getCreditSummary = (req, res) => {
  const sql = `
    SELECT
      (SELECT COALESCE(SUM(amount), 0) FROM supplier_purchases) AS total_supplier_debit,
      (SELECT COALESCE(SUM(amount), 0) FROM customer_credits) AS total_customer_credit
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      return sendError(res, "Summary Fetch Failed", err);
    }

    const summary = rows[0] || {};
    const totalSupplierDebit = toAmount(summary.total_supplier_debit);
    const totalCustomerCredit = toAmount(summary.total_customer_credit);

    res.status(200).json({
      total_supplier_debit: totalSupplierDebit,
      total_customer_credit: totalCustomerCredit,
      net_outstanding: totalCustomerCredit - totalSupplierDebit,
    });
  });
};

export const addSupplierPurchase = (req, res) => {
  const { supplier_name, amount, bill_no, purchase_date, note } = req.body;
  const missing = validateRequired({ supplier_name, amount, bill_no, purchase_date });
  const normalizedPurchaseDate = normalizeDate(purchase_date);

  if (missing) {
    return sendError(res, `${missing[0]} is required`, null, 400);
  }

  if (!validateAmount(amount)) {
    return sendError(res, "amount must be greater than 0", null, 400);
  }

  if (!normalizedPurchaseDate) {
    return sendError(res, "purchase_date must be a valid date", null, 400);
  }

  const sql = `
    INSERT INTO supplier_purchases
    (supplier_name, amount, bill_no, purchase_date, note)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [supplier_name, amount, bill_no, normalizedPurchaseDate, note || ""], (err, result) => {
    if (err) {
      return sendError(res, "Purchase Save Failed", err);
    }

    res.status(201).json({
      success: true,
      message: "Purchase Added Successfully",
      id: result.insertId,
    });
  });
};

export const getSupplierPurchases = (req, res) => {
  const sql = "SELECT * FROM supplier_purchases ORDER BY id DESC";

  db.query(sql, (err, rows) => {
    if (err) {
      return sendError(res, "Purchase Fetch Failed", err);
    }

    res.status(200).json(rows);
  });
};

export const updateSupplierPurchase = (req, res) => {
  const { id } = req.params;
  const { supplier_name, amount, bill_no, purchase_date, note } = req.body;
  const missing = validateRequired({ supplier_name, amount, bill_no, purchase_date });
  const normalizedPurchaseDate = normalizeDate(purchase_date);

  if (missing) {
    return sendError(res, `${missing[0]} is required`, null, 400);
  }

  if (!validateAmount(amount)) {
    return sendError(res, "amount must be greater than 0", null, 400);
  }

  if (!normalizedPurchaseDate) {
    return sendError(res, "purchase_date must be a valid date", null, 400);
  }

  const sql = `
    UPDATE supplier_purchases
    SET supplier_name = ?, amount = ?, bill_no = ?, purchase_date = ?, note = ?
    WHERE id = ?
  `;

  db.query(sql, [supplier_name, amount, bill_no, normalizedPurchaseDate, note || "", id], (err) => {
    if (err) {
      return sendError(res, "Purchase Update Failed", err);
    }

    res.status(200).json({
      success: true,
      message: "Purchase Updated Successfully",
    });
  });
};

export const deleteSupplierPurchase = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM supplier_purchases WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return sendError(res, "Purchase Delete Failed", err);
    }

    res.status(200).json({
      success: true,
      message: "Purchase Deleted Successfully",
    });
  });
};

export const addCredit = (req, res) => {
  const { customer_name, amount, credit_date, note } = req.body;
  const missing = validateRequired({ customer_name, amount, credit_date });
  const normalizedCreditDate = normalizeDate(credit_date);

  if (missing) {
    return sendError(res, `${missing[0]} is required`, null, 400);
  }

  if (!validateAmount(amount)) {
    return sendError(res, "amount must be greater than 0", null, 400);
  }

  if (!normalizedCreditDate) {
    return sendError(res, "credit_date must be a valid date", null, 400);
  }

  const sql = `
    INSERT INTO customer_credits
    (customer_name, amount, credit_date, note)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [customer_name, amount, normalizedCreditDate, note || ""], (err, result) => {
    if (err) {
      return sendError(res, "Credit Save Failed", err);
    }

    res.status(201).json({
      success: true,
      message: "Credit Added Successfully",
      id: result.insertId,
    });
  });
};

export const getCredits = (req, res) => {
  const sql = "SELECT * FROM customer_credits ORDER BY id DESC";

  db.query(sql, (err, rows) => {
    if (err) {
      return sendError(res, "Credit Fetch Failed", err);
    }

    res.status(200).json(rows);
  });
};

export const updateCredit = (req, res) => {
  const { id } = req.params;
  const { customer_name, amount, credit_date, note } = req.body;
  const missing = validateRequired({ customer_name, amount, credit_date });
  const normalizedCreditDate = normalizeDate(credit_date);

  if (missing) {
    return sendError(res, `${missing[0]} is required`, null, 400);
  }

  if (!validateAmount(amount)) {
    return sendError(res, "amount must be greater than 0", null, 400);
  }

  if (!normalizedCreditDate) {
    return sendError(res, "credit_date must be a valid date", null, 400);
  }

  const sql = `
    UPDATE customer_credits
    SET customer_name = ?, amount = ?, credit_date = ?, note = ?
    WHERE id = ?
  `;

  db.query(sql, [customer_name, amount, normalizedCreditDate, note || "", id], (err) => {
    if (err) {
      return sendError(res, "Credit Update Failed", err);
    }

    res.status(200).json({
      success: true,
      message: "Credit Updated Successfully",
    });
  });
};

export const deleteCredit = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM customer_credits WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return sendError(res, "Credit Delete Failed", err);
    }

    res.status(200).json({
      success: true,
      message: "Credit Deleted Successfully",
    });
  });
};
