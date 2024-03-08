import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../environments/environment';
import { PokerEvaluation } from './card.model';

const BACKEND_URL = environment.apiUrl + '/poker/';

@Injectable({
  providedIn: 'root',
})

export class PokerEvaluatorService {

  constructor(
		private http: HttpClient
	) { }

	evaluateHand( hand:string[] ) {
		console.log( 'service - eval hand');
		return this.http.post<PokerEvaluation>( BACKEND_URL, hand );
	}
}
