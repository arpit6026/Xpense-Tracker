import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import ToastContainer, { useToast } from "../components/Toast";

function Register() {
  const navigate = useNavigate();
  const { toasts, addToast } = useToast();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", formData);
      addToast("Registration Successful! Please login.", "success");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      addToast(err.response?.data?.message || "Registration Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-slate-200 text-[15px] placeholder:text-slate-600 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10";

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 relative overflow-hidden">
      <ToastContainer toasts={toasts} />

      <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl -top-32 -left-32 animate-blob pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-3xl -bottom-24 -right-24 animate-blob pointer-events-none" style={{ animationDelay: "-5s" }} />

      <div className="w-full max-w-[420px] bg-[#12121f]/80 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-12 animate-scale-in relative z-10">
        <div className="absolute inset-0 rounded-3xl p-px bg-gradient-to-br from-purple-500/20 via-transparent to-indigo-500/10 pointer-events-none" style={{ mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", maskComposite: "exclude", WebkitMaskComposite: "xor" }} />

        <span className="text-5xl block mb-3 animate-float">🚀</span>
        <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Get Started
        </h1>
        <p className="text-slate-500 text-sm mt-1 mb-8">Create your ExpenseFlow account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="register-name" className="block text-xs font-medium text-slate-400 mb-2 tracking-wide">Full Name</label>
            <input id="register-name" className={inputClass} type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="register-email" className="block text-xs font-medium text-slate-400 mb-2 tracking-wide">Email Address</label>
            <input id="register-email" className={inputClass} type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-xs font-medium text-slate-400 mb-2 tracking-wide">Password</label>
            <input id="register-password" className={inputClass} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
          </div>

          <button
            id="register-submit"
            className="w-full py-3.5 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-xl text-white font-semibold text-[15px] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(139,92,246,0.35)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <p className="text-center mt-7 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;