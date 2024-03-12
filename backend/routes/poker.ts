const express = require( "express" );
const router = express.Router();
const pokerController = require( '../controllers/poker' );

router.post( "", pokerController.evaluateOneHand );
router.post( "/simulateRound", pokerController.simulateOneRound );

module.exports = router;