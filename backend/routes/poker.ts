const express = require( "express" );
const router = express.Router();
const pokerController = require( '../controllers/poker' );

router.post( "", pokerController.evaluateOneHand );

module.exports = router;