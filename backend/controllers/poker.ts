const PokerEvaluator = require( "poker-evaluator" );
import { PokerEvaluation } from "../models/PokerEvaluation.class";

exports.evaluateOneHand = ( req: any, res: any, next: any ) => {

	console.log( "Welcome to the Poker Evaluator!" );

	let cards: string[] = req.body;

	console.log( "Hand to evaluate: ", cards );

	try {
		const evaluation: PokerEvaluation = PokerEvaluator.evalHand( cards );
		console.log( "result: ", evaluation );
		res.status( 200 ).json( evaluation );
	} catch ( error ) {
		console.log( "evaluation failed!", error );
		res.status( 500 ).json( { message: "evaluation failed!", error: error } );
	}
}
