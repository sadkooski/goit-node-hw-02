const express = require("express");
const logger = require("morgan");
const fs = require('fs').promises
const cors = require("cors");
const path = require("path");
const mongoose = require('mongoose');
const multer = require('multer')
require('dotenv').config()
require('./modules/auth/auth.strategy')

const uploadDir = path.join(process.cwd(), 'public/avatars')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const uploadMiddleware = multer({
  storage,
});



const contactsRouter = require("./modules/contacts/contacts.routing");
const authRouter = require("./modules/auth/auth.routing")

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const connection = mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Database connection successful"))
.catch((err) => {console.error("Error connecting to MongoDB:", err)
  process.exit(1)});;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const isAccessible = (folderPath) => {
  return fs
    .access(folderPath)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folderPath) => {
  if (!(await isAccessible(folderPath))) {
    await fs.mkdir(folderPath);
  }
};

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

app.use("/auth", authRouter);
app.use("/api/contacts", contactsRouter);
app.post('/api/users/avatars', uploadMiddleware.single('photo'), (req, res) => {
  return res.status(200).json({ message: 'Plik wrzucony pomyślnie'})
})

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000, () => {
  createFolderIsNotExist(uploadDir);
  console.log("Server running. Use our API on port: 3000")
})
