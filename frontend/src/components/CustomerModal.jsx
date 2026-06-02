import React, { useEffect, useState } from "react";

const EMPTY = { full_name: "", email: "", phone: "" };

const CustomerModal = ({ isOpen, onClose, onSave, initialData }) => {
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
    if (!form.full_name.trim())                    e.full_name = "Full name is required";
    if (!form.email.trim())                        e.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))    e.email     = "Enter a valid email address";
    if (!form.phone.trim())                        e.phone     = "Phone number is required";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={s.head}>
          <div>
            <p style={s.headLabel}>{isEdit ? "Edit Customer" : "New Customer"}</p>
            <h2 style={s.headTitle}>{isEdit ? form.full_name || "Update Customer" : "Add a Customer"}</h2>
          </div>
          <button style={s.closeBtn} onClick={onClose}><XIcon /></button>
        </div>

        {/* Body */}
        <div style={s.body}>

          {/* Avatar preview */}
          {form.full_name.trim() && (
            <div style={s.previewRow}>
              <div style={s.avatarPreview}>
                {form.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", margin: 0 }}>{form.full_name}</p>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{form.email || "No email yet"}</p>
              </div>
            </div>
          )}

          <Field label="Full Name" error={errors.full_name}>
            <input
              name="full_name"
              style={{ ...s.input, ...(errors.full_name ? s.inputErr : {}) }}
              placeholder="e.g. Rahul Agarwal"
              value={form.full_name}
              onChange={handleChange}
            />
          </Field>

          <Field label="Email Address" error={errors.email} hint="Must be unique">
            <input
              name="email"
              type="email"
              style={{ ...s.input, ...(errors.email ? s.inputErr : {}) }}
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </Field>

          <Field label="Phone Number" error={errors.phone}>
            <input
              name="phone"
              type="tel"
              style={{ ...s.input, ...(errors.phone ? s.inputErr : {}), fontFamily: "'Space Mono', monospace", fontSize: 13 }}
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
            />
          </Field>
        </div>

        {/* Footer */}
        <div style={s.foot}>
          <button style={s.btnCancel} onClick={onClose}>Cancel</button>
          <button style={s.btnSave} onClick={handleSubmit}>
            <CheckIcon /> {isEdit ? "Update Customer" : "Save Customer"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Field wrapper ── */
const Field = ({ label, error, hint, children }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <label style={s.label}>{label}</label>
      {hint && <span style={{ fontSize: 11, color: "#9ca3af" }}>{hint}</span>}
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
  overlay:      { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, fontFamily: "'DM Sans', sans-serif" },
  modal:        { background: "#fff", borderRadius: 16, width: 440, maxWidth: "95vw", boxShadow: "0 24px 64px rgba(0,0,0,.18)", overflow: "hidden" },

  head:         { padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", justifyContent: "space-between" },
  headLabel:    { fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 },
  headTitle:    { fontSize: 18, fontWeight: 700, color: "#111827", margin: "4px 0 0" },
  closeBtn:     { background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6, display: "flex", alignItems: "center" },

  body:         { padding: "24px" },
  previewRow:   { display: "flex", alignItems: "center", gap: 12, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 14px", marginBottom: 20 },
  avatarPreview:{ width: 40, height: 40, borderRadius: "50%", background: "#ede9fe", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 },

  label:        { fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" },
  input:        { width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#111827", outline: "none", boxSizing: "border-box", transition: "border .15s" },
  inputErr:     { borderColor: "#f87171", background: "#fff5f5" },
  errMsg:       { fontSize: 12, color: "#dc2626", marginTop: 5 },

  foot:         { padding: "16px 24px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 10 },
  btnCancel:    { padding: "9px 18px", background: "none", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnSave:      { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};

export default CustomerModal;