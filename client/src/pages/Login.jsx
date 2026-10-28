import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { errMsg } from "../api";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try { await login(f.email, f.password); nav("/"); } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <div className="hp-card narrow mx-auto">
      <h2>Sign in</h2>
      {err && <div className="alert alert-danger py-2">{err}</div>}
      <form onSubmit={submit}>
        <input className="form-control mb-3" type="email" placeholder="Email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="form-control mb-3" type="password" placeholder="Password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <button className="btn btn-brass w-100">Sign in</button>
      </form>
      <p className="mt-3 mb-0 small">New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
