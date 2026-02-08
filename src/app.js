
require("dotenv").config();
const session = require("express-session");
const express = require("express");
const helmet = require("helmet");
const path = require("path");

const connectDB = require("./config/db");
const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
const urlRoutes = require("./routes/urlRoutes");

const app = express();

/* sessions */
app.use(
   session({
      secret: process.env.SESSION_SECRET || "urlshortener_secret_key",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
   })
);

/* middlewares */
app.use(helmet());
app.use(rateLimiter);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* db */
connectDB();

/* static + views */
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* routes */
app.use("/", urlRoutes);

/* 404 */
app.use((req, res) => {
   res.status(404).render("404");
});

/* error handler */
app.use(errorHandler);

module.exports = app;
