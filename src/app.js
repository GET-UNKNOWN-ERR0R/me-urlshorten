require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const path = require("path");

const connectDB = require("./config/db");
const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
const urlRoutes = require("./routes/urlRoutes");

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(helmet());
app.use(rateLimiter);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, "public")));

/* =======================
   VIEW ENGINE
======================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =======================
   ROUTES
======================= */
app.use("/", urlRoutes);

/* =======================
   404 HANDLER
======================= */
app.use((req, res) => {
  res.status(404).render("404");
});

/* =======================
   ERROR HANDLER
======================= */
app.use(errorHandler);

/* =======================
   START SERVER AFTER DB
======================= */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
