import React from "react";

const ProductViewModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-[200] font-['DM_Sans']"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-[460px] max-w-[95vw] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
              PRODUCT DETAILS
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-1">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <Row label="SKU" value={product.sku} />
          <Row label="Price" value={`₹${Number(product.price).toLocaleString()}`} />
          <Row label="Stock Quantity" value={product.quantity_in_stock} />

          {product.description && (
            <div className="pt-4">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Description
              </p>
              <p className="text-gray-800 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* Reusable Row */
const Row = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-100 last:border-none">
    <span className="text-sm font-semibold text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

/* Icon */
const XIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M6 18L18 6M6 6h12v12" />
  </svg>
);

export default ProductViewModal;