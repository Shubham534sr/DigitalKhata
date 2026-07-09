import db from "../config/db.js";

export const addCustomer = (req, res) => {

    const {
        name,
        mobile,
        email,
        aadharNumber,
        address
    } = req.body;

    const sql = `
        INSERT INTO customers
        (
            customer_name,
            mobile,
            email,
            aadhar_number,
            address
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            mobile,
            email,
            aadharNumber,
            address
        ],
        (err, result) => {

            if (err) {
    console.error("Customer Save Error:", err);

    return res.status(500).json({
        success: false,
        message: err.sqlMessage || err.message,
        error: err
    });
}

            res.status(201).json({
                success: true,
                message: "Customer Added Successfully"
            });

        }
    );
};

export const getCustomers = (req, res) => {

    const sql =
        "SELECT * FROM customers ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed To Fetch Customers"
            });
        }

        res.status(200).json(result);

    });

};

export const deleteCustomer = (req, res) => {

    const { id } = req.params;

    const sql =
        "DELETE FROM customers WHERE id=?";

    db.query(sql, [id], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Delete Failed"
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer Deleted Successfully"
        });

    });

};

export const getCustomerTransactions = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            p.id,
            p.customer_id,
            p.customer_name,
            'Payment' AS product_name,
            p.amount,
            p.amount AS paid_amount,
            0 AS pending_amount,
            'completed' AS status,
            p.payment_date AS created_at
        FROM payments p
        WHERE p.customer_id = ?
        ORDER BY p.payment_date DESC
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            if (err.code === "ER_NO_SUCH_TABLE") {
                return res.status(200).json([]);
            }

            return res.status(500).json({
                success: false,
                message: "Failed To Fetch Transactions"
            });
        }

        const transactions = (result || []).map(item => ({
            id: item.id,
            customer_id: item.customer_id,
            customer_name: item.customer_name,
            product_name: item.product_name,
            amount: parseFloat(item.amount || 0),
            paid_amount: parseFloat(item.paid_amount || 0),
            pending_amount: parseFloat(item.pending_amount || 0),
            status: item.status,
            created_at: item.created_at
        }));

        res.status(200).json(transactions);

    });

};