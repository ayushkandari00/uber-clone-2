# Uber Clone

A full-stack ride-hailing application built with React, Node.js, Express, MongoDB, and Socket.io for real-time communication.

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet + React Leaflet** - Interactive maps
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **GSAP + @gsap/react** - Animations
- **Remixicon** - Icon library
- **ESLint** - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT (jsonwebtoken)** - Authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **cookie-parser** - Cookie parsing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload

---

## Project Structure

```
uber-clone-2/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API route definitions
│   │   ├── models/          # Mongoose models
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Custom middleware
│   │   ├── db/              # Database connection
│   │   ├── app.js           # Express app setup
│   │   ├── server.js        # Entry point
│   │   └── socket.js        # Socket.io initialization
│   ├── package.json
│   └── .env                 # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Page components
    │   ├── context/         # React contexts (auth, socket)
    │   ├── App.jsx          # Main app with routing
    │   └── main.jsx         # Entry point
    ├── package.json
    ├── vite.config.js
    └── .env                 # Environment variables
```

---

## API Endpoints

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/profile` | Get user profile | Yes (User) |
| GET | `/logout` | Logout user | Yes (User) |

### Captain Routes (`/api/captains`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new captain | No |
| POST | `/login` | Captain login | No |
| GET | `/profile` | Get captain profile | Yes (Captain) |
| GET | `/logout` | Logout captain | Yes (Captain) |

### Ride Routes (`/api/rides`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create` | Create a new ride | Yes (User) |
| GET | `/get-fare` | Get fare estimate | Yes (User) |
| POST | `/confirm` | Confirm ride (captain) | Yes (Captain) |
| GET | `/start-ride` | Start ride with OTP | Yes (Captain) |
| POST | `/end-ride` | End ride | Yes (Captain) |

### Maps Routes (`/api/maps`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/get-coordinates` | Get coordinates from address | Yes (User) |
| GET | `/get-distance-time` | Get distance & time between points | Yes (User) |
| GET | `/get-suggestions` | Get autocomplete suggestions | Yes (User) |

---

## Real-time Events (Socket.io)

### Client → Server
- `join` - User joins room
- `join-captain` - Captain joins room
- `new-ride` - User requests new ride
- `ride-confirmed` - Captain confirms ride
- `start-ride` - Captain starts ride
- `end-ride` - Captain ends ride

### Server → Client
- `new-ride` - Notify captains of new ride
- `ride-confirmed` - Notify user ride confirmed
- `ride-started` - Notify user ride started
- `ride-ended` - Notify user ride ended
- `captain-location` - Real-time captain location updates

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:

```env
PORT=4000
DB_CONNECT=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:4000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_BASE_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

Start the frontend dev server:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd Backend
npm start
```

---

## Features

- **User Authentication** - Register, login, logout with JWT tokens
- **Captain Authentication** - Separate auth flow for drivers
- **Real-time Ride Matching** - Socket.io for instant ride requests
- **Interactive Maps** - Leaflet for pickup/destination selection
- **Fare Estimation** - Distance-based pricing
- **Ride Lifecycle** - Create → Confirm → Start → End
- **OTP Verification** - Secure ride start
- **Live Tracking** - Real-time captain location updates
- **Responsive UI** - Mobile-friendly design with Tailwind CSS

---

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 4000) |
| DB_CONNECT | MongoDB connection string |
| JWT_SECRET | Secret key for JWT signing |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| VITE_BASE_URL | Backend API base URL |
| VITE_SOCKET_URL | Socket.io server URL |

---

## License

ISC