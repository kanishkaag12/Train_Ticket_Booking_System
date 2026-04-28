import { motion } from "framer-motion";
import { currency, statusClasses } from "../utils/formatters";

export default function TicketCard({ booking, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-[28px] p-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-accent-300">PNR {booking.pnrNumber}</p>
          <h3 className="mt-2 font-display text-2xl text-white">{booking.trainName}</h3>
          <p className="mt-1 text-slate-300">
            {booking.source} to {booking.destination} | {booking.journeyDate}
          </p>
          <p className="mt-2 text-sm text-slate-400">{booking.notificationMessage}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-400">Total Fare</p>
          <p className="font-display text-2xl text-white">{currency(booking.totalFare)}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{booking.paymentStatus}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {booking.passengers.map((passenger) => (
          <div key={passenger.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="font-semibold text-white">{passenger.name}</p>
            <p className="mt-1 text-sm text-slate-400">
              {passenger.gender}, {passenger.age}
            </p>
            <span className={`status-pill mt-3 ${statusClasses(passenger.status)}`}>
              {passenger.status} {passenger.seatLabel ? `• ${passenger.seatLabel}` : ""}
            </span>
          </div>
        ))}
      </div>

      {!booking.cancelled && (
        <button
          onClick={() => onCancel(booking.pnrNumber)}
          className="mt-6 rounded-full border border-danger/40 px-5 py-3 text-sm font-semibold text-danger transition hover:bg-danger/10"
        >
          Cancel Ticket
        </button>
      )}
    </motion.div>
  );
}
