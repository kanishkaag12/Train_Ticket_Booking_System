import { useEffect, useState } from "react";
import client from "../api/client";

const trainDefaults = {
  trainNumber: "",
  trainName: "",
  source: "",
  destination: "",
  journeyDate: "",
  departureTime: "",
  arrivalTime: "",
  confirmedCapacity: 0,
  racCapacity: 0,
  waitingCapacity: 0,
  fare: 0
};

export default function AdminPage() {
  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(trainDefaults);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [trainResponse, bookingResponse] = await Promise.all([
      client.get("/admin/trains"),
      client.get("/admin/bookings")
    ]);
    setTrains(trainResponse.data.data);
    setBookings(bookingResponse.data.data);
  };

  useEffect(() => {
    loadData().catch(() => setMessage("Unable to load admin data."));
  }, []);

  const submitTrain = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await client.put(`/admin/trains/${editingId}`, form);
      } else {
        await client.post("/admin/trains", form);
      }
      setForm(trainDefaults);
      setEditingId(null);
      setMessage("Train inventory updated.");
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save train.");
    }
  };

  const editTrain = (train) => {
    setEditingId(train.id);
    setForm({
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      source: train.source,
      destination: train.destination,
      journeyDate: train.journeyDate,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      confirmedCapacity: train.confirmedCapacity,
      racCapacity: train.racCapacity,
      waitingCapacity: train.waitingCapacity,
      fare: train.fare
    });
  };

  const removeTrain = async (id) => {
    await client.delete(`/admin/trains/${id}`);
    setMessage("Train removed from active inventory.");
    await loadData();
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="glass-panel rounded-[32px] p-6 md:p-8">
        <h2 className="section-title">{editingId ? "Edit Train" : "Add Train"}</h2>
        <p className="mt-2 text-slate-300">Manage seat capacities, fare bands, and journey schedules.</p>
        {message && <div className="mt-4 rounded-2xl bg-white/5 px-4 py-3 text-slate-300">{message}</div>}
        <form onSubmit={submitTrain} className="mt-6 grid gap-4 md:grid-cols-2">
          {Object.entries(form).map(([key, value]) => (
            <label key={key} className={key === "trainName" || key === "source" || key === "destination" ? "md:col-span-2" : ""}>
              <span className="mb-2 block text-sm capitalize text-slate-300">{formatLabel(key)}</span>
              <input
                type={fieldType(key)}
                value={value}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
              />
            </label>
          ))}
          <button className="rounded-2xl bg-accent-400 px-5 py-4 font-semibold text-brand-950">
            {editingId ? "Update Train" : "Create Train"}
          </button>
        </form>
      </section>

      <section className="space-y-6">
        <div className="glass-panel rounded-[32px] p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Train Inventory</h2>
            <p className="text-sm text-slate-400">{trains.length} services</p>
          </div>
          <div className="mt-5 space-y-4">
            {trains.map((train) => (
              <div key={train.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-accent-300">{train.trainNumber}</p>
                    <p className="mt-2 font-display text-xl text-white">{train.trainName}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      {train.source} to {train.destination} | {train.journeyDate}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => editTrain(train)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
                      Edit
                    </button>
                    <button onClick={() => removeTrain(train.id)} className="rounded-full border border-danger/40 px-4 py-2 text-sm text-danger">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="section-title">All Bookings</h2>
            <p className="text-sm text-slate-400">{bookings.length} records</p>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.24em] text-slate-500">
                  <th className="px-3 py-3">PNR</th>
                  <th className="px-3 py-3">Passenger</th>
                  <th className="px-3 py-3">Train</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5">
                    <td className="px-3 py-4">{booking.pnrNumber}</td>
                    <td className="px-3 py-4">{booking.passengers.map((item) => item.name).join(", ")}</td>
                    <td className="px-3 py-4">{booking.trainName}</td>
                    <td className="px-3 py-4">{booking.bookingStatusSummary}</td>
                    <td className="px-3 py-4">{booking.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function fieldType(key) {
  if (key.includes("Date")) return "date";
  if (key.includes("Time")) return "time";
  if (key === "fare" || key.includes("Capacity")) return "number";
  return "text";
}

function formatLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
