const express = require("express");
const cors = require("cors");
const { connectMongo } = require("./connect");
const userRoute = require("./routes/user");
const notesRoute = require("./routes/note");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8002;

// ─── CORS Configuration ───────────────────────────────────────────────────────
// Build allowed origins list from env + known hardcoded production URLs.
// Add your verified Vercel/Render URLs here or set FRONTEND_URL in .env.
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://frontend-ten-gamma-10.vercel.app",
  process.env.FRONTEND_URL, // optional override via env
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin header) and listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  // No credentials: true needed — we use Authorization header, not cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Handle preflight for all routes
app.options(/(.*)/,  cors(corsOptions)); // Express 5 compatible preflight handler

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/notes", notesRoute);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NotesApp API Running" });
});

async function start() {
  try {
    await connectMongo(process.env.MONGO_URL);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.log("Error while starting the app", err);
    process.exit(1);
  }
}

start();
