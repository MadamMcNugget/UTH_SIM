const PokerEvaluator = require("poker-evaluator");

exports.evalHand = (req,res,next) => {

	console.log( "Welcome to the Poker Evaluator");

	let testHand = ['Th','Jh','Qh','Kh', 'Ah'];
	let cards = req.body;

	console.log( "Hand to evaluate: ", cards );

	try{
		const evaluation = PokerEvaluator.evalHand(cards);
		console.log( "result: ", evaluation );
		res.status( 200 ).json( evaluation );
	} catch ( error ){
		console.log( "evaluation failed!", error );
		res.status( 500 ).json({ message: "evaluation failed!", error, error } );
	}
}