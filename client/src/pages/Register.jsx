import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { errMsg } from "../api";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try { await register(f.name, f.email, f.password); nav("/"); } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <div className="hp-card narrow mx-auto">
      <h2>Create account</h2>
      {err && <div className="alert alert-danger py-2">{err}</div>}
      <form onSubmit={submit}>
        <input className="form-control mb-3" placeholder="Full name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className="form-control mb-3" type="email" placeholder="Email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="form-control mb-3" type="password" placeholder="Password (6+ characters)" minLength={6} required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <button className="btn btn-brass w-100">Create account</button>
      </form>
      <p className="mt-3 mb-0 small">Already registered? <Link to="/login">Sign in</Link></p>
    </div>
  );
}
