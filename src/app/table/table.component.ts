import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PlayerHandSim, PokerEvaluation } from '../card.model';
import { PokerEvaluatorService } from '../poker-evaluator.service';
import { UtilityComponent } from '../utility/utility.component';

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
	imports: [ MatTableModule, MatSortModule, MatCardModule, MatButtonModule, MatDividerModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, UtilityComponent ],
	templateUrl: './table.component.html',
	styleUrl: './table.component.css'
} )
export class TableComponent implements OnInit, AfterViewInit {

	// table example
	displayedColumns: string[] = [ 'position', 'name', 'weight', 'symbol' ];
	dataSource = new MatTableDataSource( ELEMENT_DATA );
	constructor (
		private _liveAnnouncer: LiveAnnouncer,
		private pokerService: PokerEvaluatorService
	) { }

	// Parameters form
	simParametersForm: FormGroup = new FormGroup( {} );

	@ViewChild( MatSort ) sort: MatSort;

	ngOnInit() {
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
				d2: new FormControl<string>( '' ),
				d3: new FormControl<string>( '' )
			} )
		} )
	}

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.evaluate();
	}

	evaluate( playerCards?: string[], index?: number[] ) {
		try {
			if ( playerCards == undefined ) {
				playerCards = [ 'Qs', '9h' ];
			}
			if ( index == undefined ) {
				index = [ 2, 2, -6, 1, 1, -6, 1, 1, 1, 1, 1, 1, 1 ];
			}

			this.pokerService.simulateRound( playerCards, index ).subscribe( ( sim: PlayerHandSim ) => {
				console.log( 'round returned! result: ', sim );
			} );
		} catch ( error ) {
			console.log( 'some error happened', error );
		}
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

		this.evaluate( hand, index );
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
}
