import { useEffect, useMemo, useState } from "react";
import client from "../api/client";
import TrainCard from "../components/TrainCard";
import StatCard from "../components/StatCard";

const today = new Date();
const seededDate = new Date(today);
seededDate.setDate(seededDate.getDate() + 1);
const minDate = today.toISOString().split("T")[0];

export default function SearchPage() {
  const [search, setSearch] = useState({
    source: "New Delhi",
    destination: "Mumbai Central",
    journeyDate: seededDate.toISOString().split("T")[0]
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [stations, setStations] = useState([]);

  const stats = useMemo(() => {
    const totals = results.reduce(
      (accumulator, train) => {
        accumulator.confirmed += train.confirmedAvailable;
        accumulator.rac += train.racAvailable;
        accumulator.waiting += train.waitingAvailable;
        return accumulator;
      },
      { confirmed: 0, rac: 0, waiting: 0 }
    );

    return totals;
  }, [results]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await client.get("/trains/search", { params: search });
      const content = response.data.data.content;
      setResults(content);
      if (!content.length) {
        setMessage("No trains found for this route and date.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to fetch trains right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await client.get("/trains/stations", {
          params: { journeyDate: search.journeyDate }
        });
        setStations(response.data.data);
      } catch {
        setStations([]);
      }
    };

    loadStations();
  }, [search.journeyDate]);

  return (
    <div className="space-y-8">
      <form onSubmit={handleSearch} className="glass-panel grid gap-4 rounded-[32px] p-6 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <Field
          label="Source"
          value={search.source}
          options={stations}
          onChange={(value) => setSearch({ ...search, source: value })}
        />
        <Field
          label="Destination"
          value={search.destination}
          options={stations}
          onChange={(value) => setSearch({ ...search, destination: value })}
        />
        <Field
          label="Journey Date"
          type="date"
          value={search.journeyDate}
          min={minDate}
          onChange={(value) => setSearch({ ...search, journeyDate: value })}
        />
        <button className="self-start rounded-2xl bg-accent-400 px-6 py-4 font-semibold text-brand-950 transition hover:bg-accent-300 lg:mt-7">
          {loading ? "Searching..." : "Find Trains"}
        </button>
      </form>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Confirmed Inventory" value={stats.confirmed} helper="Green availability across matched trains" />
        <StatCard label="RAC Window" value={stats.rac} helper="Passengers nearing confirmation" />
        <StatCard label="Waitlist Slots" value={stats.waiting} helper="Dynamic queue capacity still open" />
      </section>

      {message && <div className="rounded-2xl bg-white/5 px-5 py-4 text-slate-300">{message}</div>}

      {!!stations.length && (
        <div className="glass-panel rounded-[28px] px-5 py-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Available Stations For Selected Date</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stations.map((station) => (
              <button
                key={station}
                type="button"
                onClick={() => {
                  if (!search.source) {
                    setSearch({ ...search, source: station });
                  } else if (!search.destination) {
                    setSearch({ ...search, destination: station });
                  } else {
                    setSearch({ ...search, destination: station });
                  }
                }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                {station}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Available Trains</h2>
          <p className="text-sm text-slate-400">{results.length} matching services</p>
        </div>

        <div className="space-y-5">
          {results.map((train) => (
            <TrainCard key={train.id} train={train} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, options = [], onChange, ...props }) {
  const [focused, setFocused] = useState(false);
  const normalizedValue = String(props.value ?? "").toLowerCase();
  const filteredOptions = options
    .filter((station) => station.toLowerCase().includes(normalizedValue))
    .slice(0, 6);
  const showSuggestions = label !== "Journey Date" && focused && filteredOptions.length > 0;

  return (
    <label className="relative block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        {...props}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-accent-300"
      />
      {showSuggestions && (
        <div className="mt-2 max-h-60 overflow-auto rounded-2xl border border-white/10 bg-brand-900 shadow-glow">
          {filteredOptions.map((station) => (
            <button
              key={station}
              type="button"
              onMouseDown={() => onChange(station)}
              className="block w-full border-b border-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/10 last:border-b-0"
            >
              {station}
            </button>
          ))}
        </div>
      )}
    </label>
  );
}
