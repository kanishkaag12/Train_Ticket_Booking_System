import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import client from "../api/client";
import TicketCard from "../components/TicketCard";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();

  const loadTickets = async () => {
    try {
      const response = await client.get("/bookings");
      setTickets(response.data.data);
      if (!response.data.data.length) {
        setMessage("No tickets found yet.");
      } else {
        setMessage(location.state?.successPnr ? `Booking confirmed. PNR ${location.state.successPnr}` : "");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to fetch bookings.");
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCancel = async (pnrNumber) => {
    await client.delete(`/bookings/${pnrNumber}`);
    await loadTickets();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Ticket Wallet</h2>
        <p className="text-sm text-slate-400">Track PNR, payment, and live upgrade status</p>
      </div>
      {message && <div className="rounded-2xl bg-white/5 px-5 py-4 text-slate-300">{message}</div>}
      <div className="space-y-5">
        {tickets.map((booking) => (
          <TicketCard key={booking.id} booking={booking} onCancel={handleCancel} />
        ))}
      </div>
    </div>
  );
}
