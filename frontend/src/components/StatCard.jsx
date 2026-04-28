import { motion } from "framer-motion";

export default function StatCard({ label, value, helper }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl p-5 shadow-glow"
    >
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 font-display text-3xl text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </motion.div>
  );
}
