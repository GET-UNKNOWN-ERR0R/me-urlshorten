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
app.use(
   session({
     secret: "urlshortener_secret_key",
     resave: false,
     saveUninitialized: true,
     cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
   })
 );
 
//middlewares
app.use(helmet());
app.use(rateLimiter);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", urlRoutes);

app.use((req, res) => {
   res.status(404).render("404");
});

app.use(errorHandler);

// start server after db connected

const startServer = async () => {
   try {
      await connectDB();

      const PORT = process.env.PORT || 3000;

      app.listen(PORT, () => {
         console.log(`🚀 Server running on port ${PORT}`);
      });
   } catch (error) {
      console.error("❌ Server failed to start");
      console.error(error.message);
      process.exit(1);
   }
};

startServer();
