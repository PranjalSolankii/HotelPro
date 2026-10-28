import { useEffect, useState } from "react";
import api, { errMsg } from "../api";

const blank = { number: "", type: "Single", pricePerNight: "", capacity: 2, amenities: "", description: "" };

export default function Admin() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [f, setF] = useState(blank);
  const [err, setErr] = useState("");

  const load = async () => {
    setRooms((await api.get("/rooms")).data);
    setBookings((await api.get("/bookings")).data);
  };
  useEffect(() => { load(); }, []);

  const addRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post("/rooms", { ...f, pricePerNight: +f.pricePerNight, capacity: +f.capacity, amenities: f.amenities.split(",").map((s) => s.trim()).filter(Boolean) });
      setF(blank); setErr(""); load();
    } catch (x) { setErr(errMsg(x)); }
  };
  const delRoom = async (id) => { await api.delete(`/rooms/${id}`); load(); };
  const setStatus = async (id, status) => { await api.put(`/bookings/${id}/status`, { status }); load(); };
  const d = (x) => new Date(x).toLocaleDateString("en-IN");

  return (
    <>
      <h2>Manage hotel</h2>
      <div className="row g-4">
        <div className="col-lg-4">
          <form className="hp-card" onSubmit={addRoom}>
            <h5>Add a room</h5>
            {err && <div className="alert alert-danger py-2">{err}</div>}
            <input className="form-control mb-2" placeholder="Room number" required value={f.number} onChange={(e) => setF({ ...f, number: e.target.value })} />
            <select className="form-select mb-2" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
              <option>Single</option><option>Double</option><option>Deluxe</option><option>Suite</option>
            </select>
            <input className="form-control mb-2" type="number" placeholder="Price per night (₹)" required value={f.pricePerNight} onChange={(e) => setF({ ...f, pricePerNight: e.target.value })} />
            <input className="form-control mb-2" type="number" placeholder="Capacity" value={f.capacity} onChange={(e) => setF({ ...f, capacity: e.target.value })} />
            <input className="form-control mb-2" placeholder="Amenities (comma separated)" value={f.amenities} onChange={(e) => setF({ ...f, amenities: e.target.value })} />
            <textarea className="form-control mb-3" placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
            <button className="btn btn-brass w-100">Add room</button>
          </form>
          <div className="hp-card mt-3">
            <h5>Rooms ({rooms.length})</h5>
            {rooms.map((r) => (
              <div key={r._id} className="d-flex justify-content-between small py-1 border-bottom">
                <span>{r.number} · {r.type} · ₹{r.pricePerNight}</span>
                <button className="btn btn-sm btn-link text-danger p-0" onClick={() => delRoom(r._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-8">
          <div className="hp-card">
            <h5>All bookings</h5>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead><tr><th>Guest</th><th>Room</th><th>Dates</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.user?.name}<br /><small className="text-muted">{b.user?.email}</small></td>
                      <td>{b.room?.number}</td>
                      <td>{d(b.checkIn)} to {d(b.checkOut)}</td>
                      <td>₹{b.totalPrice}</td>
                      <td>
                        <select className="form-select form-select-sm" value={b.status} onChange={(e) => setStatus(b._id, e.target.value)}>
                          <option>confirmed</option><option>checked-in</option><option>checked-out</option><option>cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
