const PokerEvaluator = require( "poker-evaluator" );
import { PokerEvaluation } from "../models/PokerEvaluation.class";
import { PlayerHandSim, Decision, Index, HandResult } from "../models/card.model";

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

exports.simulateOneRound = ( req: any, res: any, next: any ) => {
	console.log( "\nPoker controller - simulateOneRound()" );

	const deck: string[] = [ 'As', 'Ah', 'Ac', 'Ad', 'Ks', 'Kh', 'Kc', 'Kd', 'Qs', 'Qh', 'Qc', 'Qd', 'Js', 'Jh', 'Jc', 'Jd', 'Ts', 'Th', 'Tc', 'Td', '9s', '9h', '9c', '9d', '8s', '8h', '8c', '8d', '7s', '7h', '7c', '7d', '6s', '6h', '6c', '6d', '5s', '5h', '5c', '5d', '4s', '4h', '4c', '4d', '3s', '3h', '3c', '3d', '2s', '2h', '2c', '2d' ];
	const playerCards: string[] = req.body.hand;
	const index: number[] = req.body.index;
	const decision2: Decision[] = [ { handtype: 1, value: 3141 } ];	// temp
	const decision3: Decision[] = [ { handtype: 2, value: 5926 } ];	// temp


	console.log( 'playerCards: ', playerCards );
	console.log( 'index: ', index );

	let targetTotal: number = 5;

	let playerCardSim = new PlayerHandSim( playerCards, index, decision2, decision3 );
	let workingDeck: string[] = deck.filter( ( card ) => card !== playerCardSim.cards[ 0 ] && card !== playerCardSim.cards[ 1 ] );

	for ( let i = 0; i <= targetTotal; i++ ) {
		ShuffleArray( workingDeck );

		let flop: string[] = workingDeck.slice( 0, 3 );
		let river: string[] = workingDeck.slice( 3, 5 );
		let deadCards: string[] = workingDeck.slice( 5, 15 );
		let dealerCards: string[] = workingDeck.slice( 15, 17 );
		console.log( deadCards );

		let count: number = CountDeadCards( deadCards, playerCardSim.index );

		let handResult = Eval_UTH( playerCardSim.cards, dealerCards, flop, river );

		let checkBetAmount: number = EvalCheckBetAmount( playerCardSim.cards, flop, river, decision2, decision3 );

		playerCardSim.ResolveBet( count, checkBetAmount, handResult );
	}

	//console.log("index for card1 is " + playerCard.index.indexMap.get((playerCard.cards[0].substring(0,1))));
	// console.log("UnShuffled card is " + workingDeck);


	console.log( playerCardSim );

	res.status( 200 ).json( { message: "ok!", playerCardSim: playerCardSim } );

}

//-----------------------------------------------------------------------
// helper functions
function ShuffleArray( array: string[] ) {
	for ( let i = array.length - 1; i > 0; i-- ) {
		const j = Math.floor( Math.random() * ( i + 1 ) );
		[ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
	}
}
function CountDeadCards( deadCards: string[], index: Index ) {
	let count: number = 0;
	deadCards.forEach( element => {
		count = count + index.indexMap.get( ( element.substring( 0, 1 ) ) )!;


		//console.log ("dead card is " + element.substring(0,1) + " the count is " + count)
	} );
	return count
}
function Eval_UTH( playerCards: string[], dealerCards: string[], flop: string[], river: string[] ) {
	console.log( 'player cards are ' + playerCards );
	console.log( 'dealer cards are ' + dealerCards );
	console.log( 'board cards are ' + flop.concat( river ) );

	let playerHand: PokerEvaluation = PokerEvaluator.evalHand( playerCards.concat( flop, river ) );

	let dealerHand: PokerEvaluation = PokerEvaluator.evalHand( dealerCards.concat( flop, river ) );

	let isWin: number = 0;
	let bonus: number = 0;
	if ( playerHand.value > dealerHand.value ) {
		isWin = 1;
		if ( playerHand.handType == 9 && playerHand.handRank == 10 ) { bonus = 500; }
		else if ( playerHand.handType == 9 ) { bonus = 50; }
		else if ( playerHand.handType == 8 ) { bonus = 10; }
		else if ( playerHand.handType == 7 ) { bonus = 3; }
		else if ( playerHand.handType == 6 ) { bonus = 1.5; }
		else if ( playerHand.handType == 5 ) { bonus = 1; }
		else { bonus = 0 }
	}
	else if ( playerHand.value < dealerHand.value ) {
		isWin = -1;
	}
	else if ( playerHand.value == dealerHand.value ) {
		isWin = 0;
	}
	let isQualify: boolean = dealerHand.handType > 1 ? true : false;

	let handResult = new HandResult( isWin, isQualify, bonus );

	console.log( handResult );

	return handResult;
}
function EvalCheckBetAmount( playerCards: string[], flop: string[], river: string[], decision2: Decision[], decision3: Decision[] ) {
	// evaluate flop
	// evaluate river
	if ( flop.find( ( element ) => element.includes( playerCards[ 0 ].substring( 0, 1 ) ) ) || flop.find( ( element ) => element.includes( playerCards[ 1 ].substring( 0, 1 ) ) ) ) {
		return 2;
	}
	// decision2.forEach(element => {
	//   if (element.handtype === flop.handtype && flop.value >= element.value){return 2;}
	// });


	if ( river.find( ( element ) => element.includes( playerCards[ 0 ].substring( 0, 1 ) ) ) || river.find( ( element ) => element.includes( playerCards[ 1 ].substring( 0, 1 ) ) ) ) {
		return 1;
	}
	// decision3.forEach(element => {
	//   if (element.handtype === flop.handtype && flop.value >= element.value){return 1;}
	// });

	else {
		return 0;
	}
}
