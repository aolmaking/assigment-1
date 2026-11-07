const express = require("express");
const { addLog } = require("../controllers/logController");

const router = express.Router();

router.post("/", addLog);

module.exports = router;