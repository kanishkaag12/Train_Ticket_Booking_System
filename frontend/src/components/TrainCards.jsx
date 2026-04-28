export default function TrainCard({ train, onBook }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h3>{train.name}</h3>
      <p>{train.source} → {train.destination}</p>
      <p>Time: {train.time}</p>
      <button onClick={() => onBook(train)}>Book</button>
    </div>
  );
}
