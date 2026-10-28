# HotelPro – Hotel Booking and Management (MERN)

Stack: MongoDB, Express, React (Vite), Node.js, JWT auth, Bootstrap.

## Features
- Register / login with JWT and bcrypt-hashed passwords
- Search rooms by dates and type, with double-booking prevention
- Book and cancel rooms; booking history per guest
- Admin panel: add / delete rooms, update booking status (check-in, check-out)

## Setup
1. Install Node.js 16+ and Git.
2. Open the folder in VS Code and run in the terminal:
   ```
   npm run install-all
   ```
3. Open `server/.env` and set your values:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hotelpro
   JWT_SECRET=any_long_random_string
   ```
4. Seed sample rooms and an admin user (once):
   ```
   npm run seed
   ```
   Admin login: `admin@hotelpro.com` / `admin123`
5. Start both servers:
   ```
   npm run dev
   ```
   Client: http://localhost:5173 · API: http://localhost:5000

## API
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/rooms | public |
| POST/PUT/DELETE | /api/rooms | admin |
| POST | /api/bookings | guest |
| GET | /api/bookings/mine | guest |
| PUT | /api/bookings/:id/cancel | owner/admin |
| GET | /api/bookings | admin |
| PUT | /api/bookings/:id/status | admin |

> Never commit `.env`. It is listed in `.gitignore`; share `.env.example` instead.
