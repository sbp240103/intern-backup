// wiki.js - Wiki route module.

const express = require("express");
const router = express.Router();

// Home page route.
router.get("/", function (req, res) {
  res.send("Wiki home page");
});

// About page route.
router.get("/ima", function (req, res) {
  res.sendFile('abc.png', { root: __dirname + '/../public/images' });
});

module.exports = router;
