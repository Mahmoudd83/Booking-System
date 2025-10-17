const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
require("./config/passport");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const serviceRoute = require("./routes/serviceRoute");
const availabilityRoute = require("./routes/availabilityRoute");
const appointmentRoute = require("./routes/appointmentRoute");

const dbConnection = require("./config/database");
dotenv.config({ path: "config.env" });

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

dbConnection();

// mountroute;
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/service", serviceRoute);
app.use("/api/availability", availabilityRoute);
app.use("/api/appointment", appointmentRoute);

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
