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
// origin: "*" is safe here because auth uses JWT in Authorization header,
// NOT cookies. Wildcard CORS + credentials:true is what's forbidden, but
// we don't use credentials:true.
const corsOptions = {
  origin: "*",
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
