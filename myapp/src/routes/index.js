const express = require("express");
const router = express.Router();

// Root route
router.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Root route accessed");
});

module.exports = router;
