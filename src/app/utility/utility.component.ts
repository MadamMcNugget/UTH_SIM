import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgIf, NgFor, JsonPipe } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { PokerEvaluation } from '../card.model';
import { PokerEvaluatorService } from '../poker-evaluator.service';

@Component( {
	selector: 'app-utility',
	standalone: true,
	imports: [ MatExpansionModule, ReactiveFormsModule, MatInputModule, MatButtonModule, NgIf, NgFor, JsonPipe ],
	templateUrl: './utility.component.html',
	styleUrl: './utility.component.css'
} )
export class UtilityComponent implements OnInit {

	handEvaluatorForm: FormGroup;
	evaluationResult: PokerEvaluation | null = null;
	handErrors: string[] = [];

	constructor (
		private pokerEvaluatorService: PokerEvaluatorService
	) { }

	ngOnInit() {
		this.handEvaluatorForm = new FormGroup( {
			card1: new FormControl<string>( '', [ Validators.maxLength( 2 ) ] ),
			card2: new FormControl<string>( '', [ Validators.maxLength( 2 ) ] ),
			card3: new FormControl<string>( '', [ Validators.maxLength( 2 ) ] ),
			card4: new FormControl<string>( '', [ Validators.maxLength( 2 ) ] ),
			card5: new FormControl<string>( '', [ Validators.maxLength( 2 ) ] ),
			card6: new FormControl<string>( '', [ Validators.maxLength( 2 ) ] ),
			card7: new FormControl<string>( '', [ Validators.maxLength( 2 ) ] )
		} );
	}

	evaluateHand() {
		console.log( 'utility - hand evaluator ' );

		this.evaluationResult = null;

		this.validateHand();
		if ( this.handErrors.length > 0 ) {
			console.log( "hand validation failed... errors: ", this.handErrors );
			return;
		}

		let hand = this.getHand();
		hand = hand.filter( ( card: string ) => card != '' );

		console.log( 'hand to evaluate', hand );
		this.pokerEvaluatorService.evaluateHand( hand ).subscribe( ( evaluation ) => {
			console.log( 'result returned', evaluation );
			this.evaluationResult = evaluation;
		} );
	}

	getHand(): string[] {
		const hand = [
			this.handEvaluatorForm.value.card1,
			this.handEvaluatorForm.value.card2,
			this.handEvaluatorForm.value.card3,
			this.handEvaluatorForm.value.card4,
			this.handEvaluatorForm.value.card5,
			this.handEvaluatorForm.value.card6,
			this.handEvaluatorForm.value.card7
		];
		return hand;
	}

	validateHand() {

		console.log( 'Validating hand' );

		let hand: string[] = this.getHand();
		this.handErrors = [];

		// validate each card
		for ( let i = 0; i < hand.length; i++ ) {
			if ( hand[ i ].length > 0 ) {
				let error: string | null = this.pokerEvaluatorService.validateCard( hand[ i ] );
				if ( error != null ) {
					this.handErrors.push( `card ${i + 1} is not valid` );
				}
			}
		}

		// validate for number of cards
		hand = hand.filter( ( card: string ) => card != '' );
		if ( hand.length != 3 &&
			hand.length != 5 &&
			hand.length != 6 &&
			hand.length != 7 ) {
			this.handErrors.push( 'Please enter 3, 5, 6, or 7 number of cards' );
		}

		// validate for duplicates
		if ( hand.length != new Set( hand ).size ) {
			this.handErrors.push( 'There are duplicate cards. Please make sure each card is unique' );
		}
	}
}
