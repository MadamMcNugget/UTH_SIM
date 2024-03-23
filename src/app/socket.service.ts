import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from './../environments/environment';
const BACKEND_URL = environment.apiUrl + '/poker/';

@Injectable( {
	providedIn: 'root'
} )
export class SocketService {

	public message$: BehaviorSubject<string> = new BehaviorSubject( '' );
	constructor () { }

	socket = io( 'http://localhost:3000/' );

	public sendMessage( message: string ) {
		console.log( 'sending message' );
		// this.socket.emit( 'message', message );
	}

	public getNewMessage = () => {
		// this.socket.on( 'message', ( message ) => {
		// 	console.log( 'get new message', message );
		// 	this.message$.next( message );
		// } );

		// return this.message$.asObservable();
	};
}