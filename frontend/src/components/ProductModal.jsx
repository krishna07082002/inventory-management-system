import React, { useEffect, useState } from "react";

const EMPTY = { name: "", sku: "", price: "", quantity_in_stock: "" };

const ProductModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialData ? { ...initialData } : EMPTY);
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEdit = Boolean(initialData);

  const validate = () => {
    const e = {};
    if (!form.name.trim())             e.name = "Product name is required";
    if (!form.sku.trim())              e.sku  = "SKU is required";
    if (!form.price || form.price < 0) e.price = "Enter a valid price";
    if (form.quantity_in_stock === "" || form.quantity_in_stock < 0)
      e.quantity_in_stock = "Enter a valid stock quantity";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, price: Number(form.price), quantity_in_stock: Number(form.quantity_in_stock) });
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={s.head}>
          <div>
            <p style={s.headLabel}>{isEdit ? "Edit Product" : "New Product"}</p>
            <h2 style={s.headTitle}>{isEdit ? form.name || "Update Product" : "Add a Product"}</h2>
          </div>
          <button style={s.closeBtn} onClick={onClose}><XIcon /></button>
        </div>

        {/* Body */}
        <div style={s.body}>
          <Field label="Product Name" error={errors.name}>
            <input
              name="name"
              style={{ ...s.input, ...(errors.name ? s.inputErr : {}) }}
              placeholder="e.g. Wireless Headphones"
              value={form.name}
              onChange={handleChange}
            />
          </Field>

          <Field label="SKU / Code" error={errors.sku} hint="Must be unique">
            <input
              name="sku"
              style={{ ...s.input, ...(errors.sku ? s.inputErr : {}), fontFamily: "'Space Mono', monospace", fontSize: 13 }}
              placeholder="e.g. WH-001"
              value={form.sku}
              onChange={handleChange}
            />
          </Field>

          <div style={s.row}>
            <Field label="Price (₹)" error={errors.price}>
              <input
                name="price"
                type="number"
                min="0"
                style={{ ...s.input, ...(errors.price ? s.inputErr : {}) }}
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
              />
            </Field>

            <Field label="Stock Quantity" error={errors.quantity_in_stock}>
              <input
                name="quantity_in_stock"
                type="number"
                min="0"
                style={{ ...s.input, ...(errors.quantity_in_stock ? s.inputErr : {}) }}
                placeholder="0"
                value={form.quantity_in_stock}
                onChange={handleChange}
              />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div style={s.foot}>
          <button style={s.btnCancel} type="button" onClick={onClose}>Cancel</button>
          <button style={s.btnSave} type="button" onClick={handleSubmit}>
            <CheckIcon /> {isEdit ? "Update Product" : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Field wrapper ── */
const Field = ({ label, error, hint, children }) => (
  <div style={s.field}>
    <div style={s.labelRow}>
      <label style={s.label}>{label}</label>
      {hint && <span style={s.hint}>{hint}</span>}
    </div>
    {children}
    {error && <p style={s.errMsg}>{error}</p>}
  </div>
);

/* ── Icons ── */
const XIcon     = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CheckIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;

/* ── Styles ── */
const s = {
  overlay:   { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, fontFamily: "'DM Sans', sans-serif" },
  modal:     { background: "#fff", borderRadius: 16, width: 460, maxWidth: "95vw", boxShadow: "0 24px 64px rgba(0,0,0,.18)", overflow: "hidden" },

  head:      { padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", justifyContent: "space-between" },
  headLabel: { fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 },
  headTitle: { fontSize: 18, fontWeight: 700, color: "#111827", margin: "4px 0 0" },
  closeBtn:  { background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6, display: "flex", alignItems: "center" },

  body:      { padding: "24px" },
  row:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },

  field:     { marginBottom: 16 },
  labelRow:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  label:     { fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" },
  hint:      { fontSize: 11, color: "#9ca3af" },
  input:     { width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#111827", outline: "none", boxSizing: "border-box", transition: "border .15s" },
  inputErr:  { borderColor: "#f87171", background: "#fff5f5" },
  errMsg:    { fontSize: 12, color: "#dc2626", marginTop: 5 },

  foot:      { padding: "16px 24px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 10 },
  btnCancel: { padding: "9px 18px", background: "none", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnSave:   { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};

export default ProductModal;