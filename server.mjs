import express from "express";
import morganLogger from "morgan";
import cors from "cors";
import path from "path";
import mongoose from 'mongoose';
import dotenvConfig from 'dotenv';
import './modules/auth/auth.strategy.mjs';
import contactsRouter from "./modules/contacts/contacts.routing.mjs";
import authRouter from "./modules/auth/auth.routing.mjs"

dotenvConfig();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const connection = mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Database connection successful"))
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
  process.exit(1);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morganLogger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use("/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
});