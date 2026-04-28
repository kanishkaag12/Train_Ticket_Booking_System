import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { currency } from "../utils/formatters";

const emptyPassenger = { name: "", age: "", gender: "Male" };

export default function BookingFlowPage() {
  const { state } = useLocation();
  const { trainId } = useParams();
  const navigate = useNavigate();
  const train = state?.train;
  const [quotaType, setQuotaType] = useState("GENERAL");
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState([{ ...emptyPassenger }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const totalFare = useMemo(() => Number(train?.fare || 0) * passengers.length, [train?.fare, passengers.length]);

  const updatePassenger = (index, key, value) => {
    const next = [...passengers];
    next[index] = { ...next[index], [key]: value };
    setPassengers(next);
  };

  const addPassenger = () => setPassengers((current) => [...current, { ...emptyPassenger }]);

  const submitBooking = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await client.post("/bookings", {
        trainId: Number(trainId),
        quotaType,
        passengers: passengers.map((passenger) => ({ ...passenger, age: Number(passenger.age) }))
      });
      navigate("/tickets", { state: { successPnr: response.data.data.pnrNumber } });
    } catch (error) {
      setMessage(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!train) {
    return (
      <div className="glass-panel rounded-[32px] p-8 text-slate-300">
        Train context is missing. Please search again and start the booking flow from a train card.
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="glass-panel rounded-[32px] p-6 md:p-8">
        <div className="mb-8 flex flex-wrap gap-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                step === item ? "bg-white text-brand-950" : "border border-white/10 text-slate-300"
              }`}
            >
              Step {item}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="section-title">Choose Booking Quota</h2>
            <p className="text-slate-300">Use `GENERAL` for standard RAC + WL upgrades or `TQWL` to simulate a lower-priority queue.</p>
            <div className="grid gap-4 md:grid-cols-2">
              {["GENERAL", "TQWL"].map((option) => (
                <button
                  key={option}
                  onClick={() => setQuotaType(option)}
                  className={`rounded-[28px] border p-5 text-left transition ${
                    quotaType === option ? "border-accent-300 bg-accent-400/10" : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="font-display text-xl text-white">{option}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    {option === "GENERAL"
                      ? "Eligible for RAC and standard waitlist progression."
                      : "Simulated Tatkal queue with lower upgrade priority."}
                  </p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="rounded-full bg-accent-400 px-5 py-3 font-semibold text-brand-950">
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="section-title">Add Passenger Details</h2>
            {passengers.map((passenger, index) => (
              <div key={index} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="font-semibold text-white">Passenger {index + 1}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <Input label="Name" value={passenger.name} onChange={(value) => updatePassenger(index, "name", value)} />
                  <Input label="Age" type="number" value={passenger.age} onChange={(value) => updatePassenger(index, "age", value)} />
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Gender</span>
                    <select
                      value={passenger.gender}
                      onChange={(event) => updatePassenger(index, "gender", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-brand-900 px-4 py-4 text-white outline-none"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <button onClick={addPassenger} className="rounded-full border border-white/10 px-5 py-3 text-slate-200">
                Add Another Passenger
              </button>
              <button onClick={() => setStep(3)} className="rounded-full bg-accent-400 px-5 py-3 font-semibold text-brand-950">
                Review Booking
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="section-title">Review and Confirm</h2>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Selected Train</p>
              <p className="mt-2 font-display text-2xl text-white">
                {train.trainNumber} | {train.trainName}
              </p>
              <p className="mt-2 text-slate-300">
                {train.source} to {train.destination} | {train.departureTime} to {train.arrivalTime}
              </p>
              <p className="mt-4 text-slate-300">
                Quota: <span className="font-semibold text-white">{quotaType}</span>
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Passengers</p>
              <div className="mt-4 space-y-3">
                {passengers.map((passenger, index) => (
                  <div key={index} className="flex items-center justify-between rounded-2xl bg-black/10 px-4 py-3">
                    <span className="text-white">{passenger.name || `Passenger ${index + 1}`}</span>
                    <span className="text-slate-400">
                      {passenger.gender} | {passenger.age || "--"} years
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {message && <div className="rounded-2xl bg-danger/15 px-4 py-3 text-danger">{message}</div>}

            <button
              onClick={submitBooking}
              disabled={loading}
              className="rounded-full bg-accent-400 px-5 py-3 font-semibold text-brand-950 disabled:opacity-60"
            >
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        )}
      </section>

      <aside className="glass-panel rounded-[32px] p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-accent-300">Live Snapshot</p>
        <h3 className="mt-3 font-display text-2xl text-white">{train.trainName}</h3>
        <p className="mt-2 text-slate-300">
          {train.source} to {train.destination}
        </p>
        <div className="mt-6 grid gap-3">
          <Metric label="Confirmed left" value={train.confirmedAvailable} tone="text-success" />
          <Metric label="RAC left" value={train.racAvailable} tone="text-warning" />
          <Metric label="WL left" value={train.waitingAvailable} tone="text-danger" />
          <Metric label="Passengers" value={passengers.length} tone="text-white" />
          <Metric label="Estimated Fare" value={currency(totalFare)} tone="text-white" />
        </div>
      </aside>
    </div>
  );
}

function Input({ label, onChange, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        {...props}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
      />
    </label>
  );
}

function Metric({ label, value, tone }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 font-display text-2xl ${tone}`}>{value}</p>
    </div>
  );
}
