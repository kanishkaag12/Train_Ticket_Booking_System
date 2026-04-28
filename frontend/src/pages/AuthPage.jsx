import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../hooks/useAuth";

const initialForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: ""
};

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login" ? { email: form.email, password: form.password } : form;
      const response = await client.post(endpoint, payload);
      login(response.data.data);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel rounded-[36px] p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.28em] text-accent-300">RailwayNext Access</p>
          <h1 className="mt-4 font-display text-4xl text-white">A modern IRCTC-inspired booking experience</h1>
          <p className="mt-5 max-w-xl text-slate-300">
            Register as a passenger or sign in as admin to manage trains, monitor waitlists, and handle cancellations with automatic seat upgrades.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Demo User</p>
              <p className="mt-3 font-semibold text-white">user@railway.com</p>
              <p className="mt-1 text-sm text-slate-400">Password: User@123</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Demo Admin</p>
              <p className="mt-3 font-semibold text-white">admin@railway.com</p>
              <p className="mt-1 text-sm text-slate-400">Password: Admin@123</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Highlights</p>
              <p className="mt-3 font-semibold text-white">JWT, PNR, RAC, WL</p>
              <p className="mt-1 text-sm text-slate-400">Responsive booking dashboard</p>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[36px] p-8 md:p-10">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setMode("login")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-brand-950" : "text-slate-300"}`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${mode === "register" ? "bg-white text-brand-950" : "text-slate-300"}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "register" && (
              <>
                <Input label="Full Name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
                <Input label="Phone Number" value={form.phoneNumber} onChange={(value) => setForm({ ...form, phoneNumber: value })} />
              </>
            )}
            <Input label="Email Address" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            <Input label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />

            {message && <div className="rounded-2xl bg-danger/15 px-4 py-3 text-sm text-danger">{message}</div>}

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-accent-400 px-5 py-4 font-semibold text-brand-950 transition hover:bg-accent-300 disabled:opacity-60"
            >
              {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-accent-300"
      />
    </label>
  );
}
