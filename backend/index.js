const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const { connectMongo } = require("./connect");
const userRoute = require("./routes/user");
const notesRoute = require("./routes/note");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8002;

// ─── CORS Configuration for Multiple Deployments ──────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://notesapp-frontend-yicr.onrender.com",
  "https://notes-2bum9ounx-vinay-kumars-projects-b700c28a.vercel.app",
  "https://notes-q2ud9ytse-vinay-kumars-projects-b700c28a.vercel.app",
  "https://notes-app-delta-indol-47.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);
app.use("/notes", notesRoute);

app.get("/", (req, res) => {
  res.send("Server Running");
});
async function start() {
  try {
    await connectMongo(process.env.MONGO_URL);
    console.log("Mongo DB connected");
    app.listen(PORT, () => console.log(`Server Started ${PORT}`));
  } catch (err) {
    console.log("Error while starting the app", err);
    process.exit(1);
  }
}

start();
