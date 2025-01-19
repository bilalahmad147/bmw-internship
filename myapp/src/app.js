const express = require("express");
const cors = require("cors");
const dataRoutes = require("./routes/data");

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use("/data", dataRoutes);

module.exports = app;
