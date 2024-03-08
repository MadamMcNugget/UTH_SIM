const express = require("express");
const router = express.Router();
const pokerController = require('../controllers/poker');

router.post("", pokerController.evalHand );

module.exports = router;