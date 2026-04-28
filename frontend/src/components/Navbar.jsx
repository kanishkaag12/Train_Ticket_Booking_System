import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <h2>🚆 Train Booker</h2>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      <Link to="/search">Search</Link>
    </nav>
  );
}
