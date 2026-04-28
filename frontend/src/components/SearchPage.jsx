import { useState } from "react";
import { searchTrains } from "../services/api";
import TrainCard from "../components/TrainCard";

export default function Search() {
  const [form, setForm] = useState({ source: "", destination: "" });
  const [trains, setTrains] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await searchTrains(form);
      setTrains(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Search Trains</h2>
      <input
        placeholder="From"
        onChange={(e) => setForm({ ...form, source: e.target.value })}
      />
      <input
        placeholder="To"
        onChange={(e) => setForm({ ...form, destination: e.target.value })}
      />
      <button onClick={handleSearch}>Search</button>

      {trains.map((train) => (
        <TrainCard key={train.id} train={train} onBook={() => alert("Go to booking")} />
      ))}
    </div>
  );
}
