import React, { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import ProductModal from "../components/ProductModal";
import ProductViewModal from "../components/ProductViewModal";

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

const StockBadge = ({ qty }) => {
  if (qty <= 5)  return <span style={{ ...s.badge, background: "#fef2f2", color: "#dc2626" }}>Critical</span>;
  if (qty <= 15) return <span style={{ ...s.badge, background: "#fffbeb", color: "#d97706" }}>Low</span>;
  return              <span style={{ ...s.badge, background: "#ecfdf5", color: "#059669" }}>In Stock</span>;
};

/* ── component ── */
const Products = () => {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData]     = useState(null);
  const [search, setSearch]         = useState("");
  const [deleteId, setDeleteId]     = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try { setProducts(await getProducts()); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (data) => {
    try {
      if (editData) await updateProduct(editData.id, data);
      else          await createProduct(data);
      setIsModalOpen(false);
      setEditData(null);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try { await deleteProduct(id); fetchProducts(); }
    catch (err) { console.error(err); }
    finally { setDeleteId(null); }
  };

  const openAdd  = () => { setEditData(null); setIsModalOpen(true); };
  const openEdit = (p) => { setEditData(p);   setIsModalOpen(true); };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={s.loadingWrap}><div style={s.loadingCard}>Loading products…</div></div>;

  return (
    <div style={s.page}>

      {/* ── Top bar ── */}
      <div style={s.topRow}>
        <div>
          <h1 style={s.heading}>Products</h1>
          <p style={s.sub}>{products.length} products total</p>
        </div>
        <div style={s.topActions}>
          <input
            style={s.search}
            placeholder="Search name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={s.btnPrimary} onClick={openAdd}>
            <PlusIcon /> Add Product
          </button>
        </div>
      </div>

      {/* ── Table card ── */}
      <div style={s.tableCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Product", "SKU", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={s.empty}>No products found.</td>
                </tr>
              ) : filtered.map((p) => {
                const av = avatarColor(p.id);
                return (
                  <tr key={p.id} style={s.tr} onMouseEnter={e => e.currentTarget.style.background="#fafafa"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    {/* name + avatar */}
                    <td style={s.td}>
                      <div style={s.nameCell}>
                        <div style={{ ...s.avatar, background: av.bg, color: av.color }}>
                          {getInitials(p.name)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{p.name}</span>
                      </div>
                    </td>

                    {/* sku */}
                    <td style={s.td}><span style={s.sku}>{p.sku}</span></td>

                    {/* price */}
                    <td style={{ ...s.td, ...s.amount }}>₹{Number(p.price).toLocaleString("en-IN")}</td>

                    {/* stock qty */}
                    <td style={s.td}>{p.quantity_in_stock}</td>

                    {/* status badge */}
                    <td style={s.td}><StockBadge qty={p.quantity_in_stock} /></td>

                    {/* actions */}
                    <td style={s.td}>
                      <div style={s.actions}>
                        <button style={s.btnEdit} onClick={() => openEdit(p)}>
                          <EditIcon /> Edit
                        </button>
                         <button
  style={s.btnEdit}
  onClick={() => setViewProduct(p)}
>
  View
</button>
                        <button style={s.btnDel} onClick={() => setDeleteId(p.id)}>
                          <TrashIcon />
                        </button>

                       
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Product modal ── */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditData(null); }}
        onSave={handleSave}
        initialData={editData}
      />

      <ProductViewModal
  isOpen={!!viewProduct}
  product={viewProduct}
  onClose={() => setViewProduct(null)}
/>

      {/* ── Delete confirm modal ── */}
      {deleteId && (
        <div style={s.modalBg} onClick={() => setDeleteId(null)}>
          <div style={{ ...s.modal, width: 360 }} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHead}>
              <span style={s.modalTitle}>Delete Product?</span>
            </div>
            <div style={{ padding: "20px 24px", color: "#374151", fontSize: 14 }}>
              This action cannot be undone. The product will be permanently removed.
            </div>
            <div style={s.modalFoot}>
              <button style={s.btnOutline} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={{ ...s.btnPrimary, background: "#dc2626" }} onClick={() => handleDelete(deleteId)}>
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
const EditIcon  = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;

/* ── Styles ── */
const s = {
  page:        { padding: "28px", fontFamily: "'DM Sans', sans-serif", maxWidth: 1200 },
  loadingWrap: { padding: "28px" },
  loadingCard: { background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", fontSize: 15, color: "#6b7280", border: "1px solid #e5e7eb" },

  topRow:      { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" },
  heading:     { fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 },
  sub:         { fontSize: 13, color: "#6b7280", marginTop: 4 },
  topActions:  { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  search:      { padding: "9px 13px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", width: 220 },

  btnPrimary:  { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnEdit:     { display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", background: "#fef9c3", color: "#a16207", border: "1px solid #fde68a", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnDel:      { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "5px 9px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer" },
  btnOutline:  { padding: "8px 16px", background: "none", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },

  tableCard:   { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" },
  table:       { width: "100%", borderCollapse: "collapse" },
  th:          { textAlign: "left", padding: "11px 16px", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  tr:          { borderBottom: "1px solid #f3f4f6", transition: "background .1s" },
  td:          { padding: "13px 16px", fontSize: 13, color: "#111827" },
  empty:       { padding: "48px", textAlign: "center", fontSize: 14, color: "#9ca3af" },

  nameCell:    { display: "flex", alignItems: "center", gap: 10 },
  avatar:      { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  sku:         { fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: 4 },
  amount:      { fontFamily: "'Space Mono', monospace", color: "#059669", fontWeight: 700 },
  badge:       { display: "inline-flex", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 },
  actions:     { display: "flex", gap: 6, alignItems: "center" },

  modalBg:     { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  modal:       { background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.15)", width: 440 },
  modalHead:   { padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" },
  modalTitle:  { fontSize: 16, fontWeight: 600, color: "#111827" },
  modalFoot:   { padding: "16px 24px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 8 },
};

export default Products;