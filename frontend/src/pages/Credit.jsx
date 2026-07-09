import { useEffect, useMemo, useState } from "react";
import "./Credit.css";

import {
  addCredit,
  addSupplierPurchase,
  deleteCredit,
  deleteSupplierPurchase,
  getCreditSummary,
  getCredits,
  getSupplierPurchases,
  updateCredit,
  updateSupplierPurchase,
} from "./creditService";

const emptySupplierForm = {
  supplier_name: "",
  amount: "",
  bill_no: "",
  purchase_date: "",
  note: "",
};

const emptyCreditForm = {
  customer_name: "",
  amount: "",
  credit_date: "",
  note: "",
};

const formatMoney = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toInputDate = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

function Credit() {
  const [activeTab, setActiveTab] = useState("supplier");
  const [supplierPurchases, setSupplierPurchases] = useState([]);
  const [credits, setCredits] = useState([]);
  const [summary, setSummary] = useState({
    total_supplier_debit: 0,
    total_customer_credit: 0,
    net_outstanding: 0,
  });
  const [supplierForm, setSupplierForm] = useState(emptySupplierForm);
  const [creditForm, setCreditForm] = useState(emptyCreditForm);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [editingCreditId, setEditingCreditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCreditPage = async () => {
    try {
      setLoading(true);
      setError("");

      const [supplierData, creditData, summaryData] = await Promise.all([
        getSupplierPurchases(),
        getCredits(),
        getCreditSummary(),
      ]);

      setSupplierPurchases(supplierData);
      setCredits(creditData);
      setSummary(summaryData);
    } catch (err) {
      console.log(err);
      setError("Unable to load credit data. Please check backend and database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreditPage();
  }, []);

  const customerCount = useMemo(() => {
    return new Set(credits.map((item) => item.customer_name?.trim()).filter(Boolean)).size;
  }, [credits]);

  const supplierCount = useMemo(() => {
    return new Set(supplierPurchases.map((item) => item.supplier_name?.trim()).filter(Boolean)).size;
  }, [supplierPurchases]);

  const handleSupplierChange = (event) => {
    setSupplierForm({
      ...supplierForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreditChange = (event) => {
    setCreditForm({
      ...creditForm,
      [event.target.name]: event.target.value,
    });
  };

  const showSuccess = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const handleSaveSupplier = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingSupplierId) {
        await updateSupplierPurchase(editingSupplierId, supplierForm);
        showSuccess("Supplier purchase updated successfully.");
      } else {
        await addSupplierPurchase(supplierForm);
        showSuccess("Supplier purchase saved successfully.");
      }

      setSupplierForm(emptySupplierForm);
      setEditingSupplierId(null);
      await loadCreditPage();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Supplier purchase save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCredit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingCreditId) {
        await updateCredit(editingCreditId, creditForm);
        showSuccess("Customer credit updated successfully.");
      } else {
        await addCredit(creditForm);
        showSuccess("Customer credit saved successfully.");
      }

      setCreditForm(emptyCreditForm);
      setEditingCreditId(null);
      await loadCreditPage();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Customer credit save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSupplier = (item) => {
    setActiveTab("supplier");
    setEditingSupplierId(item.id);
    setSupplierForm({
      supplier_name: item.supplier_name || "",
      amount: item.amount || "",
      bill_no: item.bill_no || "",
      purchase_date: toInputDate(item.purchase_date),
      note: item.note || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditCredit = (item) => {
    setActiveTab("customer");
    setEditingCreditId(item.id);
    setCreditForm({
      customer_name: item.customer_name || "",
      amount: item.amount || "",
      credit_date: toInputDate(item.credit_date),
      note: item.note || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Delete this supplier purchase?")) return;

    try {
      await deleteSupplierPurchase(id);
      showSuccess("Supplier purchase deleted.");
      await loadCreditPage();
    } catch (err) {
      console.log(err);
      setError("Supplier purchase delete failed.");
    }
  };

  const handleDeleteCredit = async (id) => {
    if (!window.confirm("Delete this customer credit?")) return;

    try {
      await deleteCredit(id);
      showSuccess("Customer credit deleted.");
      await loadCreditPage();
    } catch (err) {
      console.log(err);
      setError("Customer credit delete failed.");
    }
  };

  return (
    <div className="credit-page">
      <div className="credit-shell">
        <div className="page-header">
          <div>
            <span className="eyebrow">Khata credit desk</span>
            <h1>Credit Management</h1>
            <p>Manage supplier purchases, customer credits, and outstanding balance.</p>
          </div>
        </div>

        {(message || error) && (
          <div className={error ? "notice error" : "notice success"}>
            {error || message}
          </div>
        )}

        <div className="summary-grid">
          <div className="summary-card">
            <span>Total Supplier Debit</span>
            <h2>{formatMoney(summary.total_supplier_debit)}</h2>
            <p>{supplierCount} suppliers recorded</p>
          </div>

          <div className="summary-card">
            <span>Total Customer Credit</span>
            <h2>{formatMoney(summary.total_customer_credit)}</h2>
            <p>{customerCount} customers recorded</p>
          </div>

          <div className="summary-card accent">
            <span>Net Outstanding</span>
            <h2>{formatMoney(summary.net_outstanding)}</h2>
            <p>Customer credit minus supplier debit</p>
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Credit modules">
          <button
            type="button"
            className={activeTab === "supplier" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("supplier")}
          >
            Supplier Purchases
          </button>

          <button
            type="button"
            className={activeTab === "customer" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("customer")}
          >
            Customer Credits
          </button>
        </div>

        {activeTab === "supplier" && (
          <>
            <form className="form-card" onSubmit={handleSaveSupplier}>
              <div className="card-header">
                <div>
                  <span className="section-label">Supplier information</span>
                  <h2>{editingSupplierId ? "Edit Supplier Purchase" : "Add Supplier Purchase"}</h2>
                </div>

                {editingSupplierId && (
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      setEditingSupplierId(null);
                      setSupplierForm(emptySupplierForm);
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Supplier Name</label>
                  <input
                    type="text"
                    name="supplier_name"
                    value={supplierForm.supplier_name}
                    onChange={handleSupplierChange}
                    placeholder="Enter supplier name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={supplierForm.amount}
                    onChange={handleSupplierChange}
                    placeholder="Enter amount"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Bill Number</label>
                  <input
                    type="text"
                    name="bill_no"
                    value={supplierForm.bill_no}
                    onChange={handleSupplierChange}
                    placeholder="Enter bill number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="purchase_date"
                    value={supplierForm.purchase_date}
                    onChange={handleSupplierChange}
                    required
                  />
                </div>
              </div>

              <div className="form-bottom-row">
                <div className="form-group note-field">
                  <label>Note</label>
                  <textarea
                    name="note"
                    value={supplierForm.note}
                    onChange={handleSupplierChange}
                    placeholder="Add payment terms, product details, or reminders"
                  />
                </div>

                <div className="form-actions">
                  <button className="primary-btn" type="submit" disabled={saving}>
                    {saving ? "Saving..." : editingSupplierId ? "Update Purchase" : "Save Purchase"}
                  </button>
                </div>
              </div>
            </form>

            <div className="table-card">
              <div className="card-header">
                <div>
                  <span className="section-label">Purchase records</span>
                  <h2>Supplier Purchase History</h2>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Supplier</th>
                      <th>Amount</th>
                      <th>Bill No</th>
                      <th>Date</th>
                      <th>Note</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="empty-cell">Loading purchases...</td>
                      </tr>
                    ) : supplierPurchases.length > 0 ? (
                      supplierPurchases.map((item) => (
                        <tr key={item.id}>
                          <td data-label="ID">{item.id}</td>
                          <td data-label="Supplier">{item.supplier_name}</td>
                          <td data-label="Amount" className="amount">{formatMoney(item.amount)}</td>
                          <td data-label="Bill No">{item.bill_no}</td>
                          <td data-label="Date">{formatDate(item.purchase_date)}</td>
                          <td data-label="Note">{item.note || "-"}</td>
                          <td data-label="Action">
                            <div className="row-actions">
                              <button className="edit-btn" type="button" onClick={() => handleEditSupplier(item)}>
                                Edit
                              </button>
                              <button className="delete-btn" type="button" onClick={() => handleDeleteSupplier(item.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="empty-cell">No supplier purchases saved yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "customer" && (
          <>
            <form className="form-card" onSubmit={handleSaveCredit}>
              <div className="card-header">
                <div>
                  <span className="section-label">Customer information</span>
                  <h2>{editingCreditId ? "Edit Customer Credit" : "Add Customer Credit"}</h2>
                </div>

                {editingCreditId && (
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      setEditingCreditId(null);
                      setCreditForm(emptyCreditForm);
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="customer-info-strip">
                <div>
                  <span>Active credit customers</span>
                  <strong>{customerCount}</strong>
                </div>
                <div>
                  <span>Total entries</span>
                  <strong>{credits.length}</strong>
                </div>
                <div>
                  <span>Customer outstanding</span>
                  <strong>{formatMoney(summary.total_customer_credit)}</strong>
                </div>
              </div>

              <div className="form-grid three-column">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={creditForm.customer_name}
                    onChange={handleCreditChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Credit Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={creditForm.amount}
                    onChange={handleCreditChange}
                    placeholder="Enter credit amount"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="credit_date"
                    value={creditForm.credit_date}
                    onChange={handleCreditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-bottom-row">
                <div className="form-group note-field">
                  <label>Note</label>
                  <textarea
                    name="note"
                    value={creditForm.note}
                    onChange={handleCreditChange}
                    placeholder="Add credit reason, promise date, or collection note"
                  />
                </div>

                <div className="form-actions">
                  <button className="primary-btn" type="submit" disabled={saving}>
                    {saving ? "Saving..." : editingCreditId ? "Update Credit" : "Save Credit"}
                  </button>
                </div>
              </div>
            </form>

            <div className="table-card">
              <div className="card-header">
                <div>
                  <span className="section-label">Credit records</span>
                  <h2>Customer Credit History</h2>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Credit</th>
                      <th>Outstanding</th>
                      <th>Date</th>
                      <th>Note</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="empty-cell">Loading customer credits...</td>
                      </tr>
                    ) : credits.length > 0 ? (
                      credits.map((item) => (
                        <tr key={item.id}>
                          <td data-label="ID">{item.id}</td>
                          <td data-label="Customer">{item.customer_name}</td>
                          <td data-label="Credit" className="amount">{formatMoney(item.amount)}</td>
                          <td data-label="Outstanding" className="outstanding">{formatMoney(item.amount)}</td>
                          <td data-label="Date">{formatDate(item.credit_date)}</td>
                          <td data-label="Note">{item.note || "-"}</td>
                          <td data-label="Action">
                            <div className="row-actions">
                              <button className="edit-btn" type="button" onClick={() => handleEditCredit(item)}>
                                Edit
                              </button>
                              <button className="delete-btn" type="button" onClick={() => handleDeleteCredit(item.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="empty-cell">No customer credits saved yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Credit;
