import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgFor, JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray } from '@angular/forms';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { Decision, PlayerHandSim, PokerEvaluation } from '../card.model';
import { PokerEvaluatorService } from '../poker-evaluator.service';
import { UtilityComponent } from '../utility/utility.component';
import { catchError, last, map, tap } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { SocketService } from '../socket.service';

export interface PeriodicElement {
	name: string;
	position: number;
	weight: number;
	symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
	{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
	{ position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
	{ position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
	{ position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
	{ position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
	{ position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
	{ position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
	{ position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
	{ position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
	{ position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component( {
	selector: 'app-table',
	standalone: true,
	imports: [
		MatTableModule, MatSortModule, MatCardModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule,
		ReactiveFormsModule, UtilityComponent, NgFor, JsonPipe ],
	templateUrl: './table.component.html',
	styleUrl: './table.component.css'
} )
export class TableComponent implements OnInit, AfterViewInit {

	// table example
	displayedColumns: string[] = [ 'position', 'name', 'weight', 'symbol' ];
	dataSource = new MatTableDataSource( ELEMENT_DATA );

	// Parameters form
	simParametersForm: FormGroup = new FormGroup( {} );

	constructor (
		private _liveAnnouncer: LiveAnnouncer,
		private pokerService: PokerEvaluatorService,
		private socketService: SocketService
	) { }

	@ViewChild( MatSort ) sort: MatSort;

	ngOnInit() {

		// prep evaluate hand form
		this.simParametersForm = new FormGroup( {
			playerCards: new FormGroup( {
				card1: new FormControl<string>( '' ),
				card2: new FormControl<string>( '' )
			} ),
			index: new FormGroup( {
				iA: new FormControl<number>( 0 ),
				iK: new FormControl<number>( 0 ),
				iQ: new FormControl<number>( 0 ),
				iJ: new FormControl<number>( 0 ),
				iT: new FormControl<number>( 0 ),
				i9: new FormControl<number>( 0 ),
				i8: new FormControl<number>( 0 ),
				i7: new FormControl<number>( 0 ),
				i6: new FormControl<number>( 0 ),
				i5: new FormControl<number>( 0 ),
				i4: new FormControl<number>( 0 ),
				i3: new FormControl<number>( 0 ),
				i2: new FormControl<number>( 0 )
			} ),
			decision: new FormGroup( {
				d2: new FormArray( [] ),
				d3: new FormArray( [] ),
			} ),
			runCount: new FormControl<number>( 0 )
		} )

		this.addDecisionPoint( 2 );
		this.addDecisionPoint( 3 );

		// setup socket
		// this.socketService.getNewMessage().subscribe( ( message: string ) => {
		// 	console.log( `message received: ${ message }` );
		// } )
	}

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		//this.evaluate();
	}

	// sendMessage() {
  //   this.socketService.sendMessage( 'a new message!' );
  // }

	evaluate( playerCards: string[] = [ 'Qs', '9h' ], index: number[] = [ 2, 2, -6, 1, 1, -6, 1, 1, 1, 1, 1, 1, 1 ],
		decision2: Decision[] = [], decision3: Decision[] = [], runCount: number = 1 ) {
		try {
			this.pokerService.simulateRound( playerCards, index, decision2, decision3, runCount ).subscribe( event => {
				console.log( 'return event', event );
			} )
		} catch ( error ) {
			console.log( 'some error happened', error );
		}
	}


	//-------------------------------------------------------------------------
	// http functions

	private getEventMessage( event: HttpEvent<PlayerHandSim>, runCount: number ): string {
		console.log( 'returned event', event );
		switch ( event.type ) {
			case HttpEventType.Sent:
				return `HttpEventType.Sent`;

			case HttpEventType.UploadProgress:
				// Compute and show the % done:
				const percentDone = event.total ? Math.round( 100 * event.loaded / event.total ) : 0;
				return `HttpEventType.UploadProgress - some % simulated`;

			case HttpEventType.Response:
				return `HttpEventType.Response - simulation of `;

			default:
				return `something went wrong`;
		}
	}

	showProgress( message: string ) {
		console.log( message );
	}

	//---------------------------------------------------

	simulate() {
		console.log( 'sim! ' );
		console.log( this.simParametersForm.value );

		const hand: string[] = [ this.simParametersForm.value.playerCards.card1, this.simParametersForm.value.playerCards.card2 ]
		const index: number[] = [
			this.simParametersForm.value.index.iA,
			this.simParametersForm.value.index.iK,
			this.simParametersForm.value.index.iQ,
			this.simParametersForm.value.index.iJ,
			this.simParametersForm.value.index.iT,
			this.simParametersForm.value.index.i9,
			this.simParametersForm.value.index.i8,
			this.simParametersForm.value.index.i7,
			this.simParametersForm.value.index.i6,
			this.simParametersForm.value.index.i5,
			this.simParametersForm.value.index.i4,
			this.simParametersForm.value.index.i3,
			this.simParametersForm.value.index.i2,
		]
		const decision2: Decision[] = this.getDecisionArray( 2 );
		const decision3: Decision[] = this.getDecisionArray( 3 );
		const runCount: number = this.simParametersForm.value.runCount;

		this.evaluate( hand, index, decision2, decision3, runCount );
	}

	getDecision2Controls(): FormGroup[] {
		return <FormGroup[]>( <FormArray>( <FormGroup>this.simParametersForm.controls[ 'decision' ] ).controls[ 'd2' ] ).controls;
	}

	getDecision3Controls(): FormGroup[] {
		return <FormGroup[]>( <FormArray>( <FormGroup>this.simParametersForm.controls[ 'decision' ] ).controls[ 'd3' ] ).controls;
	}

	addDecisionPoint( decisionPoint: number ): void {

		const desicionPointForm: FormGroup = new FormGroup( {
			handType: new FormControl<number>( 0 ),
			value: new FormControl<number>( 0 )
		} )

		switch ( decisionPoint ) {
			case 2: {
				( <FormArray>this.simParametersForm.get( 'decision' )!.get( 'd2' ) ).push( desicionPointForm );
				break;
			}
			case 3: {
				( <FormArray>this.simParametersForm.get( 'decision' )!.get( 'd3' ) ).push( desicionPointForm );
				break;
			}
			default: {
				throw new Error( `addDecisionFormGroup( ) - decision point ${decisionPoint} does not exist` );
			}
		}
	}

	getDescisionFormGroupArray( decision: number ): FormGroup[] {

		let decisionFormGroup: FormGroup[] = [];

		switch ( decision ) {
			case 2: {
				decisionFormGroup = <FormGroup[]>( <FormArray>( <FormGroup>this.simParametersForm.controls[ 'decision' ] ).controls[ 'd2' ] ).controls;
				break;
			}
			case 3: {
				decisionFormGroup = <FormGroup[]>( <FormArray>( <FormGroup>this.simParametersForm.controls[ 'decision' ] ).controls[ 'd3' ] ).controls;
				break;
			}
			default: {
				throw new Error( `addDecisionFormGroup( ) - decision point ${decision} does not exist` );
			}
		}

		return decisionFormGroup;
	}

	getDecisionArray( decision: number ): Decision[] {

		const decisionFormGroup = this.getDescisionFormGroupArray( decision );
		let decisions: Decision[] = [];

		for ( let i = 0; i < decisionFormGroup.length; i++ ) {
			let handtype = decisionFormGroup[ i ].controls[ 'handType' ].value;
			let value = decisionFormGroup[ i ].controls[ 'value' ].value;
			decisions.push( {
				handtype: handtype,
				value: value
			} );
		}
		return decisions;
	}

	removeDecisionPoint( decisionPoint: number, index: number ): void {
		console.log( `remove from decision ${decisionPoint} at index ${index}` );
		switch ( decisionPoint ) {
			case 2: {
				// ( <FormArray>this.simParametersForm.get( 'decision' )?.get( 'd2' ) ).removeAt( index );
				( <FormArray>( <FormGroup>this.simParametersForm.controls[ 'decision' ] ).controls[ 'd2' ] ).removeAt( index );
				break;
			}
			case 3: {
				( <FormArray>this.simParametersForm.get( 'decision' )?.get( 'd3' ) ).removeAt( index );
				break;
			}
			default: {
				throw new Error( `addDecisionFormGroup( ) - decision point ${decisionPoint} does not exist` );
			}
		}
	}

	async evaluateHand( hand: string[] ): Promise<PokerEvaluation> {

		let evaluation: PokerEvaluation = new PokerEvaluation();
		await new Promise<void>( ( resolve, reject ) => {
			this.pokerService.evaluateHand( hand ).subscribe( {
				next: newPokerEvaluation => {
					console.log( "evaluation return: ", newPokerEvaluation );
					evaluation = newPokerEvaluation;
				},
				error: error => {
					console.log( "evaluation error: ", error );
					reject( error );
				},
				complete: () => {
					resolve();
				}
			} )
		} );

		return evaluation;
	}


	/** Announce the change in sort state for assistive technology. */
	announceSortChange( sortState: Sort ) {
		// This example uses English messages. If your application supports
		// multiple language, you would internationalize these strings.
		// Furthermore, you can customize the message to add additional
		// details about the values being sorted.
		if ( sortState.direction ) {
			this._liveAnnouncer.announce( `Sorted ${sortState.direction} ending` );
		} else {
			this._liveAnnouncer.announce( 'Sorting cleared' );
		}
	}

}

