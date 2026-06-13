import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["rgba(52,211,153,0.8)", "rgba(251,113,133,0.8)"],
        borderColor: ["rgba(52,211,153,1)", "rgba(251,113,133,1)"],
        borderWidth: 2,
        hoverOffset: 8,
        spacing: 4,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,15,30,0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        bodyFont: { family: "Inter", size: 13 },
        titleFont: { family: "Outfit", size: 14, weight: 600 },
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toLocaleString("en-IN")}`,
        },
      },
    },
    animation: { animateRotate: true, animateScale: true, duration: 800, easing: "easeOutQuart" },
  };

  if (income === 0 && expense === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4 opacity-40">📊</div>
        <p className="text-sm font-semibold text-slate-400">No data yet</p>
        <p className="text-xs text-slate-600 mt-1">Add transactions to see your chart</p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-[240px] mx-auto">
        <Doughnut data={data} options={options} />
      </div>
      <div className="flex flex-col gap-3 mt-6">
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400">Income</span>
          </div>
          <span className="text-sm font-semibold font-display text-emerald-400">₹{income.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-xs text-slate-400">Expense</span>
          </div>
          <span className="text-sm font-semibold font-display text-rose-400">₹{expense.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}

export default PieChart;