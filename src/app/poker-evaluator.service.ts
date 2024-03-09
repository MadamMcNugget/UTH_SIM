import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../environments/environment';
import { PokerEvaluation } from './card.model';

const BACKEND_URL = environment.apiUrl + '/poker/';

@Injectable( {
	providedIn: 'root',
} )

export class PokerEvaluatorService {

	constructor (
		private http: HttpClient
	) { }

	evaluateHand( hand: string[] ) {
		console.log( 'poker-evaluator.service - evaluateHand( )' );
		return this.http.post<PokerEvaluation>( BACKEND_URL, hand );
	}

	validateCard( card: string ): string | null {
		let errorMsg = null;
		console.log('validating card: ' + card);

		const validNumber: string[] = [ 'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2' ];
		const validSuit: string[] = [ 's', 'h', 'c', 'd' ];

		if ( card.length != 2 ||
			!validNumber.includes( card.substring( 0, 1 ).toUpperCase() ) ||
			!validSuit.includes( card.substring( 1, 2 ).toLowerCase() )
		) {
			errorMsg = "not a valid card";
		}

		return errorMsg;
	}
}
