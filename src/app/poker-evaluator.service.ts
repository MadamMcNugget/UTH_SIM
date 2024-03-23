import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';

import { environment } from './../environments/environment';
import { Decision, PlayerHandSim, PokerEvaluation } from './card.model';
import { catchError, last, map, tap } from 'rxjs';

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

	simulateRound( hand: string[], index: number[], decision2: Decision[], decision3: Decision[], runCount: number ) {
		console.log( 'poker-evaluator.service - evaluateRound( )' );
		const data = {
			hand: hand,
			index: index,
			decision2: decision2,
			decision3: decision3,
			runCount: runCount
		}
		const req = new HttpRequest( 'POST', BACKEND_URL + 'simulateRound', data, {
			reportProgress: true
		} );
		return this.http.request<PlayerHandSim>( req ).pipe(
			map( event => this.getEventMessage( event, runCount ) ),
			tap( message => this.showProgress( message ) ),
			last() // return last (completed) message to caller
		)
	}
	private getEventMessage( event: HttpEvent<PlayerHandSim>, runCount: number ): string {
		console.log( 'returned event', event );
		switch ( event.type ) {
			case HttpEventType.Sent:
				console.log( 'returned event', event );
				return `HttpEventType.Sent`;

			case HttpEventType.UploadProgress:
				// Compute and show the % done:
				const percentDone = event.total ? Math.round( 100 * event.loaded / event.total ) : 0;
				return `HttpEventType.UploadProgress - some % simulated`;

			case HttpEventType.Response:
				return `HttpEventType.Response - simulation done!`;

			default:
				return `something went wrong`;
		}
	}

	showProgress( message: string ){
		console.log( message );
	}

	//------------------------------------------------------------------------
	// helper functions
	validateCard( card: string ): string | null {
		let errorMsg = null;
		console.log( 'validating card: ' + card );

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
