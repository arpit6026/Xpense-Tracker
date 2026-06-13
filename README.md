# 💰 Xpense Tracker

A full-stack **MERN** expense tracking application with authentication, real-time dashboard, and beautiful UI.

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, Chart.js      |
| Backend  | Node.js, Express 5, MongoDB, Mongoose       |
| Auth     | JWT + bcryptjs                               |

## Project Structure

```
├── client/          # React frontend (Vite)
│   └── src/
│       ├── Pages/         # Login, Register, Dashboard
│       ├── components/    # PieChart, Toast
│       └── services/      # Axios API layer
├── server/          # Express backend
│   ├── config/      # DB connection
│   ├── controllers/ # Auth & Transaction logic
│   ├── middleware/   # JWT auth middleware
│   ├── models/      # Mongoose schemas
│   └── routes/      # API routes
```

## Local Development

### 1. Clone the repo
```bash
git clone https://github.com/arpit6026/Xpense-Tracker.git
cd Xpense-Tracker
```

### 2. Setup the Server
```bash
cd server
npm install
cp .env.example .env     # then fill in your values
npm run dev
```

### 3. Setup the Client
```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:5001`.

## Environment Variables

### Server (`server/.env`)
| Variable       | Description                                         |
| -------------- | --------------------------------------------------- |
| `MONGO_URI`    | MongoDB Atlas connection string                     |
| `JWT_SECRET`   | Secret key for signing JWT tokens                   |
| `PORT`         | Server port (default: 5001, auto-set by Render)     |
| `FRONTEND_URL` | Deployed frontend URL for CORS (comma-separated)    |

### Client (`client/.env`)
| Variable       | Description                                         |
| -------------- | --------------------------------------------------- |
| `VITE_API_URL` | Deployed backend API URL (e.g. `https://x.onrender.com/api`) |

## Deployment

See the deployment guide below for step-by-step instructions on deploying to **Render** (backend) and **Vercel** (frontend).

## License

MIT
