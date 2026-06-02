import React, { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard";

/* ── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ title, value, icon, iconBg, iconColor }) => (
  <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 hover:shadow-lg transition-all duration-200">
    <div
      className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-4"
      style={{ background: iconBg, color: iconColor }}
    >
      {icon}
    </div>
    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-[0.5px]">
      {title}
    </p>
    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 font-mono tracking-tight">
      {value ?? "—"}
    </h2>
  </div>
);

/* ── Stock Bar ──────────────────────────────────────────────── */
const StockBar = ({ qty, max = 50 }) => {
  const pct = Math.min((qty / max) * 100, 100);
  const isCritical = qty <= 5;
  const barColor = isCritical ? "bg-red-500" : "bg-amber-500";
  const textColor = isCritical ? "text-red-600" : "text-amber-600";

  return (
    <div className="flex items-center gap-3 w-full">
      <span className={`font-bold text-sm w-8 flex-shrink-0 ${textColor}`}>
        {qty}
      </span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/* ── Badge ──────────────────────────────────────────────────── */
const Badge = ({ label, type = "red" }) => {
  const base = "inline-flex items-center px-3 py-1 text-xs font-bold rounded-full";
  const colors = {
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return <span className={`${base} ${colors[type]}`}>{label}</span>;
};

/* ── Dashboard ──────────────────────────────────────────────── */
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white border border-gray-200 rounded-2xl px-10 py-8 text-gray-500 shadow-sm">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const lowStock = data?.low_stock_products ?? [];

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Products"
          value={data?.total_products}
          icon={<PackageIcon />}
          iconBg="#dbeafe"
          iconColor="#1d4ed8"
        />
        <StatCard
          title="Total Customers"
          value={data?.total_customers}
          icon={<UsersIcon />}
          iconBg="#ede9fe"
          iconColor="#7c3aed"
        />
        <StatCard
          title="Total Orders"
          value={data?.total_orders}
          icon={<CartIcon />}
          iconBg="#ecfdf5"
          iconColor="#059669"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStock.length}
          icon={<AlertIcon />}
          iconBg="#fffbeb"
          iconColor="#d97706"
        />
      </div>

      {/* Low Stock Section - FIXED */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-5 sm:px-8 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            ⚠ Low Stock Products
          </h2>
          {lowStock.length > 0 && (
            <Badge
              label={`${lowStock.length} items need attention`}
              type="red"
            />
          )}
        </div>

        {lowStock.length === 0 ? (
          <div className="py-16 sm:py-24 text-center">
            <span className="text-6xl">🎉</span>
            <p className="mt-4 text-gray-500 text-base sm:text-lg">
              All products are well stocked!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <table className="w-full min-w-[580px] text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest px-5 sm:px-8 py-4 whitespace-nowrap">
                    Product
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest px-5 sm:px-8 py-4 whitespace-nowrap">
                    SKU
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest px-5 sm:px-8 py-4 whitespace-nowrap">
                    Stock Level
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest px-5 sm:px-8 py-4 whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowStock.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 sm:px-8 py-5 font-medium text-gray-900">
                      {p.name}
                    </td>
                    <td className="px-5 sm:px-8 py-5">
                      <span className="font-mono text-xs bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600">
                        {p.sku}
                      </span>
                    </td>
                    <td className="px-5 sm:px-8 py-5">
                      <StockBar qty={p.quantity_in_stock} />
                    </td>
                    <td className="px-5 sm:px-8 py-5">
                      <Badge
                        label={p.quantity_in_stock <= 5 ? "Critical" : "Low"}
                        type={p.quantity_in_stock <= 5 ? "red" : "amber"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* Icons */
const PackageIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CartIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default Dashboard;