import db from "../config/db.js";

export const getSuppliers = (req, res) => {
  db.query("SELECT * FROM suppliers ORDER BY id DESC", (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Supplier Fetch Failed",
      });
    }

    res.status(200).json(result);
  });
};

export const addSupplier = (req, res) => {
  const {
    supplier_name,
    amount,
    bill_no,
    purchase_date,
    note,
  } = req.body;

  const sql = `
    INSERT INTO suppliers
    (supplier_name, amount, bill_no, purchase_date, note)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [supplier_name, amount, bill_no, purchase_date, note || ""],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Supplier Save Failed",
        });
      }

      res.status(201).json({
        success: true,
        message: "Supplier Added",
      });
    }
  );
};

export const deleteSupplier = (req, res) => {
  db.query("DELETE FROM suppliers WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Supplier Delete Failed",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier Deleted",
    });
  });
};
