const express = require("express");
const cookieparser = require("cookie-parser");
const { connectMongo } = require("./connect");
const userRoute = require("./routes/user");
const notesRoute = require("./routes/note");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded());
app.use("/user", userRoute);
app.use("/notes", notesRoute);

app.get("/", (req, res) => {
  res.send("Server Running");
});
async function start() {
  try {
    await connectMongo(process.env.MONGO_URL);
    console.log("Mongo DB conected");
    app.listen(process.env.PORT, () =>
      console.log(`Server Started ${process.env.PORT}`),
    );
  } catch (err) {
    console.log("Error while starting the app", err);
    process.exit(1);
  }
}

start();
