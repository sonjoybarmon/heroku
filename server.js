const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

// Routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const trade = require("./routes/api/trade");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
// const db = require("./config/keys").mongoURI;

// mongodb+srv://sree:sree@cluster0.5trbi.mongodb.net/myDb?retryWrites=true&w=majority

// Connect to MongoDB

mongoose
  .connect(
    "mongodb+srv://sree:sree@cluster0.5trbi.mongodb.net/myDb?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// mongoose
//   .connect(
//     db,
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config (strategy)
require("./config/passport.js")(passport);

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/trade", trade);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

// CORS
app.use(cors());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
