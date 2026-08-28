const express = require("express");
const { summarize } = require("../controllers/summaryController");

const router = express.Router();

router.post("/summarize", summarize);

module.exports = router;
