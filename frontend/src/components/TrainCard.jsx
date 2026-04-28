import { Clock3, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { currency } from "../utils/formatters";

function AvailabilityPill({ label, value, tone }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${tone}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function TrainCard({ train }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden rounded-[28px] border-white/10"
    >
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent-300">{train.trainNumber}</p>
            <h3 className="mt-2 font-display text-2xl text-white">{train.trainName}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-accent-300" />
              {train.source} to {train.destination}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 size={16} className="text-accent-300" />
              {train.departureTime} to {train.arrivalTime}
            </span>
            <span className="inline-flex items-center gap-2">
              <Ticket size={16} className="text-accent-300" />
              {currency(train.fare)}
            </span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3 lg:w-[420px]">
          <AvailabilityPill label="Confirmed" value={train.confirmedAvailable} tone="border-success/25 bg-success/10" />
          <AvailabilityPill label="RAC" value={train.racAvailable} tone="border-warning/25 bg-warning/10" />
          <AvailabilityPill label="Waitlist" value={train.waitingAvailable} tone="border-danger/25 bg-danger/10" />
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/10 px-6 py-4">
        <Link
          to={`/book/${train.id}`}
          state={{ train }}
          className="inline-flex items-center rounded-full bg-accent-400 px-5 py-3 font-semibold text-brand-950 transition hover:bg-accent-300"
        >
          Book This Train
        </Link>
      </div>
    </motion.div>
  );
}
