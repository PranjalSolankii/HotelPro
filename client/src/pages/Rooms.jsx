import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../context/AuthContext.jsx";

const today = () => new Date().toISOString().slice(0, 10);

export default function Rooms() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [q, setQ] = useState({ checkIn: "", checkOut: "", type: "" });
  const [guests, setGuests] = useState(1);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    const params = Object.fromEntries(Object.entries(q).filter(([, v]) => v));
    setRooms((await api.get("/rooms", { params })).data);
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const book = async (room) => {
    if (!user) return nav("/login");
    if (!q.checkIn || !q.checkOut) return setMsg({ ok: false, t: "Pick check-in and check-out dates first." });
    try {
      await api.post("/bookings", { roomId: room._id, checkIn: q.checkIn, checkOut: q.checkOut, guests });
      setMsg({ ok: true, t: `Room ${room.number} booked. See it under My bookings.` });
      load();
    } catch (e) { setMsg({ ok: false, t: errMsg(e) }); }
  };

  return (
    <>
      <section className="hp-hero">
        <h1>Find a room for your stay</h1>
        <div className="row g-2 mt-3">
          <div className="col-md-3"><label className="small">Check-in</label><input type="date" min={today()} className="form-control" value={q.checkIn} onChange={(e) => setQ({ ...q, checkIn: e.target.value })} /></div>
          <div className="col-md-3"><label className="small">Check-out</label><input type="date" min={q.checkIn || today()} className="form-control" value={q.checkOut} onChange={(e) => setQ({ ...q, checkOut: e.target.value })} /></div>
          <div className="col-md-2"><label className="small">Guests</label><input type="number" min="1" max="6" className="form-control" value={guests} onChange={(e) => setGuests(+e.target.value)} /></div>
          <div className="col-md-2"><label className="small">Room type</label>
            <select className="form-select" value={q.type} onChange={(e) => setQ({ ...q, type: e.target.value })}>
              <option value="">Any</option><option>Single</option><option>Double</option><option>Deluxe</option><option>Suite</option>
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end"><button className="btn btn-brass w-100" onClick={load}>Search rooms</button></div>
        </div>
      </section>

      {msg && <div className={`alert ${msg.ok ? "alert-success" : "alert-danger"} mt-3`}>{msg.t}</div>}

      <div className="row g-3 mt-1">
        {rooms.length === 0 && <p className="mt-4">No rooms are free for those dates. Try different dates or another room type.</p>}
        {rooms.map((r) => (
          <div className="col-md-6 col-lg-4" key={r._id}>
            <div className="hp-card h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-baseline">
                <h3 className="mb-0">{r.type} · {r.number}</h3>
                <strong>₹{r.pricePerNight.toLocaleString("en-IN")}<small className="text-muted"> /night</small></strong>
              </div>
              <p className="my-2">{r.description}</p>
              <p className="small text-muted mb-3">Sleeps {r.capacity} · {r.amenities.join(", ")}</p>
              <button className="btn btn-brass mt-auto" onClick={() => book(r)}>Book this room</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
