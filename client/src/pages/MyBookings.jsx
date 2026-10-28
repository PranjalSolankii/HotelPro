import { useEffect, useState } from "react";
import api from "../api";

export default function MyBookings() {
  const [list, setList] = useState([]);
  const load = async () => setList((await api.get("/bookings/mine")).data);
  useEffect(() => { load(); }, []);
  const cancel = async (id) => { await api.put(`/bookings/${id}/cancel`); load(); };
  const d = (x) => new Date(x).toLocaleDateString("en-IN");

  return (
    <>
      <h2>My bookings</h2>
      {list.length === 0 && <p>You have no bookings yet. Search for a room to make your first one.</p>}
      {list.map((b) => (
        <div key={b._id} className="hp-card mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h5 className="mb-1">{b.room?.type} · Room {b.room?.number}</h5>
            <div className="small">{d(b.checkIn)} to {d(b.checkOut)} · {b.guests} guest(s)</div>
            <div className="small text-muted">Total ₹{b.totalPrice.toLocaleString("en-IN")} · Payment {b.paymentStatus}</div>
          </div>
          <div className="text-end">
            <span className={`badge ${b.status === "cancelled" ? "bg-secondary" : "bg-success"} mb-2`}>{b.status}</span><br />
            {b.status === "confirmed" && <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(b._id)}>Cancel booking</button>}
          </div>
        </div>
      ))}
    </>
  );
}
