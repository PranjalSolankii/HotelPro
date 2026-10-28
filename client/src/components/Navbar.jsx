import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="hp-nav">
      <div className="container d-flex align-items-center justify-content-between py-3">
        <Link to="/" className="hp-brand">HotelPro</Link>
        <nav className="d-flex align-items-center gap-3">
          <Link to="/">Rooms</Link>
          {user && <Link to="/bookings">My bookings</Link>}
          {user?.role === "admin" && <Link to="/admin">Manage</Link>}
          {user ? (
            <button className="btn btn-sm btn-outline-light" onClick={() => { logout(); nav("/"); }}>
              Sign out ({user.name.split(" ")[0]})
            </button>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/register" className="btn btn-sm btn-brass">Create account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
