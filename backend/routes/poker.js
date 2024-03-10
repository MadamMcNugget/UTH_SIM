const express = require("express");
const router = express.Router();
const pokerController = require('../controllers/poker');
const uthController = require('../dist/out-tsc/uth.controller');

// router.post("", pokerController.evalHand );
router.post("", uthController.evalHand );

module.exports = router;