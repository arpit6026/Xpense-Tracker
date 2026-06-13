import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import PieChart from "../components/PieChart";
import ToastContainer, { useToast } from "../components/Toast";

const CATEGORIES = [
  "Food", "Transport", "Shopping", "Entertainment",
  "Bills", "Health", "Education", "Salary", "Freelance", "Other"
];

const CATEGORY_ICONS = {
  Food: "🍔", Transport: "🚗", Shopping: "🛍️", Entertainment: "🎬",
  Bills: "📄", Health: "💊", Education: "📚", Salary: "💼",
  Freelance: "💻", Other: "📌", default: "💸"
};

function Dashboard() {
  const navigate = useNavigate();
  const { toasts, addToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({ title: "", amount: "", type: "expense", category: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/"); return; }
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try { const res = await API.get("/transactions"); setTransactions(res.data.transactions); }
    catch (err) { console.log(err); }
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/transactions/${editingId}`, formData);
        setEditingId(null);
        addToast("Transaction updated!", "success");
      } else {
        await API.post("/transactions", formData);
        addToast("Transaction added!", "success");
      }
      setFormData({ title: "", amount: "", type: "expense", category: "" });
      fetchTransactions();
    } catch { addToast("Something went wrong", "error"); }
  };

  const deleteTransaction = async (id) => {
    try { await API.delete(`/transactions/${id}`); addToast("Deleted", "info"); fetchTransactions(); }
    catch { addToast("Failed to delete", "error"); }
  };

  const editTransaction = (txn) => {
    setEditingId(txn._id);
    setFormData({ title: txn.title, amount: txn.amount, type: txn.type, category: txn.category });
    addToast("Editing transaction...", "info");
  };

  const cancelEdit = () => { setEditingId(null); setFormData({ title: "", amount: "", type: "expense", category: "" }); };

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const filtered = transactions.filter((t) => filter === "all" || t.type === filter);
  const fmt = (n) => n.toLocaleString("en-IN");
  const icon = (cat) => CATEGORY_ICONS[cat] || CATEGORY_ICONS.default;

  const logout = () => { localStorage.removeItem("token"); navigate("/"); };

  const inputClass = "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-slate-200 text-sm placeholder:text-slate-600 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10";

  return (
    <div className="min-h-dvh flex flex-col">
      <ToastContainer toasts={toasts} />

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#06060e]/80 backdrop-blur-xl border-b border-white/[0.05] sticky top-0 z-50 animate-fade-up">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💰</span>
          <h1 className="font-display text-xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">ExpenseFlow</h1>
        </div>
        <button id="logout-btn" onClick={logout} className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-rose-500/20 hover:border-rose-500/40 hover:-translate-y-0.5">
          ⏻ Logout
        </button>
      </nav>

      {/* ── Content ── */}
      <div className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            { label: "Total Balance", value: balance, color: "violet", iconEmoji: "💎", textColor: "text-slate-100" },
            { label: "Total Income", value: totalIncome, color: "emerald", iconEmoji: "📈", textColor: "text-emerald-400" },
            { label: "Total Expense", value: totalExpense, color: "rose", iconEmoji: "📉", textColor: "text-rose-400" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`group relative bg-[#12121f]/70 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] animate-fade-up`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Top gradient line */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${stat.color === "violet" ? "from-indigo-500 to-purple-500" : stat.color === "emerald" ? "from-emerald-500 to-teal-400" : "from-rose-500 to-pink-400"}`} />
              {/* Hover glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${stat.color === "violet" ? "bg-violet-500/[0.04]" : stat.color === "emerald" ? "bg-emerald-500/[0.04]" : "bg-rose-500/[0.04]"}`} />
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 ${stat.color === "violet" ? "bg-violet-500/10" : stat.color === "emerald" ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
                {stat.iconEmoji}
              </div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.08em] mb-1">{stat.label}</p>
              <p className={`font-display text-3xl font-bold ${stat.textColor}`}>₹{fmt(stat.value)}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* ── Add Transaction ── */}
            <div className="bg-[#12121f]/70 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-7 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold text-slate-100 flex items-center gap-2.5">
                  <span className="text-xl">{editingId ? "✏️" : "➕"}</span>
                  {editingId ? "Edit Transaction" : "Add Transaction"}
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className="w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.04] flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.07] transition-all cursor-pointer text-sm">✕</button>
                )}
              </div>

              <form onSubmit={addTransaction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Title</label>
                  <input className={inputClass} type="text" name="title" placeholder="e.g. Grocery shopping" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Amount (₹)</label>
                  <input className={inputClass} type="number" name="amount" placeholder="0" value={formData.amount} onChange={handleChange} required min="1" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Type</label>
                  <div className="flex gap-2">
                    {["income", "expense"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t })}
                        className={`flex-1 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 ${
                          formData.type === t
                            ? t === "income"
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                              : "bg-rose-500/10 border-rose-500/40 text-rose-400"
                            : "bg-white/[0.04] border-white/[0.06] text-slate-500 hover:border-white/[0.12]"
                        }`}
                      >
                        {t === "income" ? "📈" : "📉"} {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Category</label>
                  <select
                    className={`${inputClass} appearance-none cursor-pointer bg-[length:12px] bg-[right_14px_center] bg-no-repeat`}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E\")" }}
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{icon(c)} {c}</option>)}
                  </select>
                </div>
                <button type="submit" className="sm:col-span-2 py-3.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-xl text-white font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(139,92,246,0.3)] active:translate-y-0 flex items-center justify-center gap-2">
                  {editingId ? "✓ Update Transaction" : "➕ Add Transaction"}
                </button>
              </form>
            </div>

            {/* ── Transactions List ── */}
            <div className="bg-[#12121f]/70 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-7 animate-fade-up" style={{ animationDelay: "0.25s" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold text-slate-100 flex items-center gap-2.5">
                  <span className="text-xl">📋</span> Transactions
                </h2>
                <div className="flex gap-1 bg-white/[0.04] rounded-full p-1">
                  {["all", "income", "expense"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${
                        filter === f
                          ? "bg-violet-500/15 text-violet-400"
                          : "text-slate-500 hover:text-slate-400"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4 opacity-40">📭</div>
                  <p className="text-sm font-semibold text-slate-400">No transactions found</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {filter !== "all" ? `No ${filter} transactions yet` : "Start by adding your first transaction above"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-[480px] overflow-y-auto pr-1">
                  {filtered.map((txn, i) => (
                    <div
                      key={txn._id}
                      className="group flex items-center gap-3.5 px-4 py-3.5 bg-white/[0.02] border border-white/[0.04] rounded-xl transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.08] hover:translate-x-1 animate-fade-up"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${txn.type === "income" ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
                        {icon(txn.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{txn.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{txn.category}</p>
                      </div>
                      <span className={`font-display text-base font-semibold shrink-0 ${txn.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                        {txn.type === "income" ? "+" : "-"}₹{fmt(txn.amount)}
                      </span>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button onClick={() => editTransaction(txn)} title="Edit" className="w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.04] flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.07] transition-all cursor-pointer text-xs">✎</button>
                        <button onClick={() => deleteTransaction(txn._id)} title="Delete" className="w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.04] flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer text-xs">🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Chart */}
          <div className="bg-[#12121f]/70 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-7 h-fit animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="font-display text-lg font-semibold text-slate-100 flex items-center gap-2.5 mb-6">
              <span className="text-xl">📊</span> Finance Overview
            </h2>
            <PieChart transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;