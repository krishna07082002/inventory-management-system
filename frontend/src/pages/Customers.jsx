import React, { useEffect, useState } from "react";
import { getCustomers, createCustomer, deleteCustomer } from "../api/customers";
import CustomerModal from "../components/CustomerModal";

/* ── helpers ── */
const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const AVATAR_COLORS = [
  { bg: "#dbeafe", color: "#1d4ed8" },
  { bg: "#ede9fe", color: "#7c3aed" },
  { bg: "#ecfdf5", color: "#059669" },
  { bg: "#fef3c7", color: "#d97706" },
  { bg: "#fce7f3", color: "#db2777" },
];
const avatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

/* ── component ── */
const Customers = () => {
  const [customers, setCustomers]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch]           = useState("");
  const [deleteId, setDeleteId]       = useState(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try { setCustomers(await getCustomers()); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (data) => {
    try {
      await createCustomer(data);
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try { await deleteCustomer(id); fetchCustomers(); }
    catch (err) { console.error(err); }
    finally { setDeleteId(null); }
  };

  const filtered = customers.filter((c) =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || "").includes(search)
  );

  if (loading) return (
    <div style={s.page}>
      <div style={s.loadingCard}>Loading customers…</div>
    </div>
  );

  return (
    <div style={s.page}>

      {/* ── Top bar ── */}
      <div style={s.topRow}>
        <div>
          <h1 style={s.heading}>Customers</h1>
          <p style={s.sub}>{customers.length} customers registered</p>
        </div>
        <div style={s.topActions}>
          <input
            style={s.search}
            placeholder="Search name, email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={s.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <PlusIcon /> Add Customer
          </button>
        </div>
      </div>

      {/* ── Table card ── */}
      <div style={s.tableCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Customer", "Email", "Phone", "Action"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={s.empty}>No customers found.</td>
                </tr>
              ) : filtered.map((c) => {
                const av = avatarColor(c.id);
                return (
                  <tr
                    key={c.id}
                    style={s.tr}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* name + avatar */}
                    <td style={s.td}>
                      <div style={s.nameCell}>
                        <div style={{ ...s.avatar, background: av.bg, color: av.color }}>
                          {getInitials(c.full_name)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{c.full_name}</span>
                      </div>
                    </td>

                    {/* email */}
                    <td style={s.td}>
                      <a href={`mailto:${c.email}`} style={s.emailLink}>{c.email}</a>
                    </td>

                    {/* phone */}
                    <td style={{ ...s.td, fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#374151" }}>
                      {c.phone || "—"}
                    </td>

                    {/* delete */}
                    <td style={s.td}>
                      <button style={s.btnDel} onClick={() => setDeleteId(c.id)}>
                        <TrashIcon /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Customer modal ── */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* ── Delete confirm modal ── */}
      {deleteId && (
        <div style={s.modalBg} onClick={() => setDeleteId(null)}>
          <div style={s.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={s.confirmHead}>
              <span style={s.confirmTitle}>Delete Customer?</span>
            </div>
            <div style={s.confirmBody}>
              This will permanently remove the customer and cannot be undone.
            </div>
            <div style={s.confirmFoot}>
              <button style={s.btnOutline} onClick={() => setDeleteId(null)}>Cancel</button>
              <button
                style={{ ...s.btnPrimary, background: "#dc2626" }}
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Icons ── */
const PlusIcon  = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;

/* ── Styles ── */
const s = {
  page:        { padding: "28px", fontFamily: "'DM Sans', sans-serif", maxWidth: 1200 },
  loadingCard: { background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", fontSize: 15, color: "#6b7280", border: "1px solid #e5e7eb" },

  topRow:      { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" },
  heading:     { fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 },
  sub:         { fontSize: 13, color: "#6b7280", marginTop: 4 },
  topActions:  { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  search:      { padding: "9px 13px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", width: 240 },

  btnPrimary:  { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnDel:      { display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnOutline:  { padding: "8px 16px", background: "none", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },

  tableCard:   { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" },
  table:       { width: "100%", borderCollapse: "collapse" },
  th:          { textAlign: "left", padding: "11px 16px", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  tr:          { borderBottom: "1px solid #f3f4f6", transition: "background .1s" },
  td:          { padding: "13px 16px", fontSize: 13, color: "#111827" },
  empty:       { padding: "48px", textAlign: "center", fontSize: 14, color: "#9ca3af" },

  nameCell:    { display: "flex", alignItems: "center", gap: 10 },
  avatar:      { width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  emailLink:   { color: "#4f46e5", textDecoration: "none", fontSize: 13 },

  modalBg:     { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  confirmModal:{ background: "#fff", borderRadius: 16, width: 380, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.15)" },
  confirmHead: { padding: "20px 24px", borderBottom: "1px solid #e5e7eb" },
  confirmTitle:{ fontSize: 16, fontWeight: 600, color: "#111827" },
  confirmBody: { padding: "20px 24px", fontSize: 14, color: "#374151", lineHeight: 1.6 },
  confirmFoot: { padding: "16px 24px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 10 },
};

export default Customers;