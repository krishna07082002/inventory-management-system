import React, { useEffect, useState } from "react";
import { getOrders, createOrder, deleteOrder } from "../api/orders";
import { getCustomers } from "../api/customers";
import { getProducts } from "../api/products";
import OrderModal from "../components/OrderModal";

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
const avatarColor = (id) => AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];

/* ── component ── */
const Orders = () => {
  const [orders, setOrders]         = useState([]);
  const [customers, setCustomers]   = useState([]);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [search, setSearch]         = useState("");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [o, c, p] = await Promise.all([getOrders(), getCustomers(), getProducts()]);
      setOrders(o); setCustomers(c); setProducts(p);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (data) => {
    await createOrder(data);
    setIsModalOpen(false);
    fetchAll();
  };

  const handleDelete = async (id) => {
    try { await deleteOrder(id); fetchAll(); }
    catch (err) { console.error(err); }
    finally { setDeleteId(null); }
  };

  /* resolve IDs → names */
  const customerName = (id) => customers.find((c) => c.id === id)?.full_name || `#${id}`;
  const productName  = (id) => products.find((p)  => p.id === id)?.name      || `#${id}`;

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      customerName(o.customer_id).toLowerCase().includes(q) ||
      productName(o.product_id).toLowerCase().includes(q)   ||
      String(o.id).includes(q)
    );
  });

  if (loading) return (
    <div style={s.page}><div style={s.loadingCard}>Loading orders…</div></div>
  );

  return (
    <div style={s.page}>

      {/* ── Top bar ── */}
      <div style={s.topRow}>
        <div>
          <h1 style={s.heading}>Orders</h1>
          <p style={s.sub}>{orders.length} orders total</p>
        </div>
        <div style={s.topActions}>
          <input
            style={s.search}
            placeholder="Search by customer, product, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={s.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <CartPlusIcon /> New Order
          </button>
        </div>
      </div>

      {/* ── Orders table ── */}
      <div style={s.tableCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Order ID", "Customer", "Product", "Qty", "Total", "Action"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={s.empty}>
                    {orders.length === 0 ? "No orders yet. Create your first order!" : "No orders match your search."}
                  </td>
                </tr>
              ) : filtered.map((o) => {
                const cName = customerName(o.customer_id);
                const pName = productName(o.product_id);
                const av    = avatarColor(o.customer_id);
                return (
                  <tr
                    key={o.id}
                    style={s.tr}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* order id */}
                    <td style={s.td}>
                      <span style={s.orderId}>#{String(o.id).padStart(4, "0")}</span>
                    </td>

                    {/* customer */}
                    <td style={s.td}>
                      <div style={s.nameCell}>
                        <div style={{ ...s.avatar, background: av.bg, color: av.color }}>
                          {getInitials(cName)}
                        </div>
                        <span style={{ fontWeight: 500, fontSize: 13 }}>{cName}</span>
                      </div>
                    </td>

                    {/* product */}
                    <td style={{ ...s.td, color: "#374151" }}>{pName}</td>

                    {/* qty */}
                    <td style={{ ...s.td, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
                      {o.quantity}
                    </td>

                    {/* total */}
                    <td style={{ ...s.td, ...s.amount }}>
                      ₹{Number(o.total_amount).toLocaleString("en-IN")}
                    </td>

                    {/* delete */}
                    <td style={s.td}>
                      <button style={s.btnDel} onClick={() => setDeleteId(o.id)}>
                        <TrashIcon /> Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Order Modal ── */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        customers={customers}
        products={products}
      />

      {/* ── Delete confirm modal ── */}
      {deleteId && (
        <div style={s.modalBg} onClick={() => setDeleteId(null)}>
          <div style={s.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={s.confirmHead}>Cancel this Order?</div>
            <div style={s.confirmBody}>
              Order{" "}
              <strong style={{ fontFamily: "'Space Mono', monospace" }}>
                #{String(deleteId).padStart(4, "0")}
              </strong>{" "}
              will be permanently cancelled and stock will be restored.
            </div>
            <div style={s.confirmFoot}>
              <button style={s.btnOutline} onClick={() => setDeleteId(null)}>Keep Order</button>
              <button
                style={{ ...s.btnPrimary, background: "#dc2626" }}
                onClick={() => handleDelete(deleteId)}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Icons ── */
const CartPlusIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    <line x1="17" y1="9" x2="17" y2="15"/><line x1="14" y1="12" x2="20" y2="12"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

/* ── Styles ── */
const s = {
  page:        { padding: "28px", fontFamily: "'DM Sans', sans-serif", maxWidth: 1200 },
  loadingCard: { background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", fontSize: 15, color: "#6b7280", border: "1px solid #e5e7eb" },

  topRow:      { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" },
  heading:     { fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 },
  sub:         { fontSize: 13, color: "#6b7280", marginTop: 4 },
  topActions:  { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  search:      { padding: "9px 13px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", width: 260 },

  btnPrimary:  { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnDel:      { display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnOutline:  { padding: "8px 16px", background: "none", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },

  tableCard:   { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" },
  table:       { width: "100%", borderCollapse: "collapse" },
  th:          { textAlign: "left", padding: "11px 16px", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  tr:          { borderBottom: "1px solid #f3f4f6", transition: "background .1s" },
  td:          { padding: "13px 16px", fontSize: 13, color: "#111827" },
  empty:       { padding: "56px", textAlign: "center", fontSize: 14, color: "#9ca3af" },

  nameCell:    { display: "flex", alignItems: "center", gap: 10 },
  avatar:      { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  orderId:     { fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: 4 },
  amount:      { fontFamily: "'Space Mono', monospace", color: "#059669", fontWeight: 700 },

  modalBg:     { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  confirmModal:{ background: "#fff", borderRadius: 16, width: 400, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.15)" },
  confirmHead: { padding: "20px 24px", borderBottom: "1px solid #e5e7eb", fontSize: 16, fontWeight: 600, color: "#111827" },
  confirmBody: { padding: "20px 24px", fontSize: 14, color: "#374151", lineHeight: 1.6 },
  confirmFoot: { padding: "16px 24px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 10 },
};

export default Orders;