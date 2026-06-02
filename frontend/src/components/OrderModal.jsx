import React, { useEffect, useState } from "react";

const EMPTY = { customer_id: "", product_id: "", quantity: 1 };

const OrderModal = ({ isOpen, onClose, onSave, customers = [], products = [] }) => {
  const [form, setForm]         = useState(EMPTY);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(EMPTY);
    setErrors({});
    setSubmitting(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct  = products.find((p) => p.id === Number(form.product_id));
  const selectedCustomer = customers.find((c) => c.id === Number(form.customer_id));
  const estTotal = selectedProduct
    ? (selectedProduct.price * Number(form.quantity || 0)).toLocaleString("en-IN")
    : null;

  const validate = () => {
    const e = {};
    if (!form.customer_id)                         e.customer_id = "Please select a customer";
    if (!form.product_id)                          e.product_id  = "Please select a product";
    if (!form.quantity || Number(form.quantity) < 1)
      e.quantity = "Quantity must be at least 1";
    else if (selectedProduct && Number(form.quantity) > selectedProduct.quantity_in_stock)
      e.quantity = `Only ${selectedProduct.quantity_in_stock} units available in stock`;
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await onSave({
        customer_id: Number(form.customer_id),
        product_id:  Number(form.product_id),
        quantity:    Number(form.quantity),
      });
    } catch (err) {
      setErrors({ global: err?.response?.data?.detail || "Failed to place order. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div style={s.head}>
          <div>
            <p style={s.headLabel}>New Order</p>
            <h2 style={s.headTitle}>Create an Order</h2>
          </div>
          <button style={s.closeBtn} onClick={onClose}><XIcon /></button>
        </div>

        {/* ── Body ── */}
        <div style={s.body}>

          {/* Order summary preview */}
          {selectedCustomer && selectedProduct && (
            <div style={s.previewCard}>
              <div style={s.previewRow}>
                <div style={s.previewAvatar}>
                  {getInitials(selectedCustomer.full_name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={s.previewName}>{selectedCustomer.full_name}</p>
                  <p style={s.previewSub}>ordering {form.quantity}× {selectedProduct.name}</p>
                </div>
                <div style={s.previewTotal}>₹{estTotal}</div>
              </div>
            </div>
          )}

          {/* Customer */}
          <Field label="Customer" error={errors.customer_id}>
            <select
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              style={{ ...s.select, ...(errors.customer_id ? s.inputErr : {}) }}
            >
              <option value="">Select a customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name} — {c.email}</option>
              ))}
            </select>
          </Field>

          {/* Product */}
          <Field label="Product" error={errors.product_id}>
            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              style={{ ...s.select, ...(errors.product_id ? s.inputErr : {}) }}
            >
              <option value="">Select a product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.quantity_in_stock === 0}>
                  {p.name} — ₹{Number(p.price).toLocaleString("en-IN")} &nbsp;|&nbsp; Stock: {p.quantity_in_stock}
                  {p.quantity_in_stock === 0 ? " (Out of stock)" : ""}
                </option>
              ))}
            </select>
          </Field>

          {/* Stock info pill */}
          {selectedProduct && (
            <div style={{
              ...s.stockPill,
              background: selectedProduct.quantity_in_stock <= 5 ? "#fef2f2" : "#f0fdf4",
              borderColor: selectedProduct.quantity_in_stock <= 5 ? "#fecaca" : "#bbf7d0",
              color:       selectedProduct.quantity_in_stock <= 5 ? "#dc2626" : "#059669",
            }}>
              <StockIcon low={selectedProduct.quantity_in_stock <= 5} />
              {selectedProduct.quantity_in_stock <= 5
                ? `Low stock — only ${selectedProduct.quantity_in_stock} units left`
                : `${selectedProduct.quantity_in_stock} units available in stock`}
            </div>
          )}

          {/* Quantity row */}
          <div style={s.qtyRow}>
            <Field label={`Quantity${selectedProduct ? ` (max ${selectedProduct.quantity_in_stock})` : ""}`} error={errors.quantity} style={{ flex: 1 }}>
              <input
                name="quantity"
                type="number"
                min="1"
                max={selectedProduct?.quantity_in_stock}
                value={form.quantity}
                onChange={handleChange}
                style={{ ...s.input, ...(errors.quantity ? s.inputErr : {}), fontFamily: "'Space Mono', monospace" }}
              />
            </Field>

            <Field label="Est. Total" style={{ flex: 1 }}>
              <div style={s.totalBox}>
                {estTotal ? `₹${estTotal}` : "—"}
              </div>
            </Field>
          </div>

          {/* Global error */}
          {errors.global && (
            <div style={s.globalErr}>{errors.global}</div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={s.foot}>
          <button style={s.btnCancel} onClick={onClose} disabled={submitting}>Cancel</button>
          <button
            style={{ ...s.btnSave, opacity: submitting ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            <CartIcon />
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Field wrapper ── */
const Field = ({ label, error, children, style: extStyle }) => (
  <div style={{ marginBottom: 16, ...extStyle }}>
    <label style={s.label}>{label}</label>
    {children}
    {error && <p style={s.errMsg}>{error}</p>}
  </div>
);

/* ── Helpers ── */
const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

/* ── Icons ── */
const XIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CartIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    <line x1="17" y1="9" x2="17" y2="15"/><line x1="14" y1="12" x2="20" y2="12"/>
  </svg>
);
const StockIcon = ({ low }) => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {low
      ? <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>
      : <><polyline points="20 6 9 17 4 12"/></>
    }
  </svg>
);

/* ── Styles ── */
const s = {
  overlay:      { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, fontFamily: "'DM Sans', sans-serif" },
  modal:        { background: "#fff", borderRadius: 16, width: 480, maxWidth: "95vw", boxShadow: "0 24px 64px rgba(0,0,0,.18)", overflow: "hidden" },

  head:         { padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", justifyContent: "space-between" },
  headLabel:    { fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 },
  headTitle:    { fontSize: 18, fontWeight: 700, color: "#111827", margin: "4px 0 0" },
  closeBtn:     { background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6, display: "flex", alignItems: "center" },

  body:         { padding: "24px" },

  /* preview card */
  previewCard:  { background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 10, padding: "14px 16px", marginBottom: 20 },
  previewRow:   { display: "flex", alignItems: "center", gap: 12 },
  previewAvatar:{ width: 38, height: 38, borderRadius: "50%", background: "#ede9fe", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 },
  previewName:  { fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 },
  previewSub:   { fontSize: 12, color: "#6b7280", marginTop: 2 },
  previewTotal: { fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: "#059669", flexShrink: 0 },

  label:        { display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 },
  select:       { width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: "#111827", outline: "none", background: "#fff", cursor: "pointer", boxSizing: "border-box" },
  input:        { width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", outline: "none", boxSizing: "border-box" },
  inputErr:     { borderColor: "#f87171", background: "#fff5f5" },
  errMsg:       { fontSize: 12, color: "#dc2626", marginTop: 5 },
  globalErr:    { fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginTop: 4 },

  stockPill:    { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, border: "1px solid", marginBottom: 16, marginTop: -8 },

  qtyRow:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  totalBox:     { padding: "10px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#059669" },

  foot:         { padding: "16px 24px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 10 },
  btnCancel:    { padding: "9px 18px", background: "none", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnSave:      { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};

export default OrderModal;