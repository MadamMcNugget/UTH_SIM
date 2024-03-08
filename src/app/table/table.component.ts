import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { LiveAnnouncer} from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PlayerHandSim, Index, HandResult, PokerEvaluation } from '../card.model';
import { PokerEvaluatorService } from '../poker-evaluator.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ MatTableModule, MatSortModule, MatCardModule, MatButtonModule, MatDividerModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit, AfterViewInit {

	// table example
	displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  constructor(
		private _liveAnnouncer: LiveAnnouncer,
		private pokerService: PokerEvaluatorService
	) {}

	// Parameters form
	simParametersForm:FormGroup = new FormGroup({});

  @ViewChild(MatSort) sort: MatSort;

	ngOnInit() {
		this.simParametersForm = new FormGroup({
			playerCards: new FormGroup({
				card1: new FormControl<string>( '' ),
				card2: new FormControl<string>( '' )
			}),
			index: new FormGroup({
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
			}),
			decision: new FormGroup({
				d2: new FormControl<string>( '' ),
				d3: new FormControl<string>( '' )
			})
		})
	}

  ngAfterViewInit() {
		this.evaluate( );
  }

	async evaluate( playerCards?: string[], index?: number[] ){
		try{
      this.dataSource.sort = this.sort;
      let deck:string[]=['As', 'Ah', 'Ac','Ad','Ks', 'Kh', 'Kc','Kd','Qs', 'Qh', 'Qc','Qd','Js', 'Jh', 'Jc','Jd', 'Ts', 'Th', 'Tc','Td','9s', '9h', '9c','9d','8s', '8h', '8c','8d','7s', '7h', '7c','7d','6s', '6h', '6c','6d','5s', '5h', '5c','5d','4s', '4h', '4c','4d','3s', '3h', '3c','3d','2s', '2h', '2c','2d'];
      
			if( playerCards == undefined ){
				playerCards = ['Qs', '9h'];
			}
			if( index == undefined ){
				index = [2,2,-6,1,1,-6,1,1,1,1,1,1,1];
			}

      let targetTotal :number = 5;

      let playerCardSim= new PlayerHandSim(playerCards, index);
      let workingDeck:string[]= deck.filter((card)=> card !== playerCardSim.cards[0] && card!==playerCardSim.cards[1] );

      for (let i=0; i<=targetTotal; i++){
        this.ShuffleArray(workingDeck);

        let flop:string[]=workingDeck.slice(0,3);
        let river:string[]=workingDeck.slice(3,5);
        let deadCards:string[]=workingDeck.slice(5,15);
        let dealerCards:string[]=workingDeck.slice(15,17);
        console.log(deadCards);

        let count:number= this.CountDeadCards(deadCards,playerCardSim.index);
        //let testhand:string[]= ['Th','Jh','Qh','Kh','Ah'];

        //console.log(PokerEvaluator.evalHand(testhand));

        let handResult= await this.Eval_UTH(playerCardSim.cards, dealerCards,flop,river);

        let checkBetAmount:number = this.EvalCheckBetAmount(playerCardSim.cards, flop, river);



        playerCardSim.ResolveBet(count, checkBetAmount, handResult);
      }

      //console.log("index for card1 is " + playerCard.index.indexMap.get((playerCard.cards[0].substring(0,1))));
      // console.log("UnShuffled card is " + workingDeck);


      console.log(playerCardSim);


    }

    catch(error){
			console.log( 'some error happened', error );
    }
	}


  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  ShuffleArray(array:string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
  CountDeadCards(deadCards:string[], index:Index){
    let count:number = 0;
    deadCards.forEach(element => {
      count = count + index.indexMap.get((element.substring(0,1)))!;


      //console.log ("dead card is " + element.substring(0,1) + " the count is " + count)
    });
    return count
  }

  async Eval_UTH (playerCards:string[], dealerCards:string[], flop:string[], river:string[]){
    console.log('player cards are ' + playerCards );
    console.log('dealer cards are ' + dealerCards );
    console.log('board cards are ' + flop.concat(river) );

    let playerHand:PokerEvaluation = await this.evaluateHand(playerCards.concat(flop, river));

    let dealerHand:PokerEvaluation = await this.evaluateHand(dealerCards.concat(flop, river));

    let isWin:number = 0;
    let bonus:number = 0;
    if (playerHand.value > dealerHand.value){
      isWin = 1;
      if(playerHand.handType==9 && playerHand.handRank==10){bonus = 500;}
      else if(playerHand.handType==9){bonus = 50;}
      else if(playerHand.handType==8){bonus = 10;}
      else if(playerHand.handType==7){bonus = 3;}
      else if(playerHand.handType==6){bonus = 1.5;}
      else if(playerHand.handType==5){bonus = 1;}
      else{bonus = 0}
    }
    else if (playerHand.value < dealerHand.value){
      isWin = -1;
    }
    else if (playerHand.value == dealerHand.value){
      isWin = 0;
    }
    let isQualify:boolean = dealerHand.handType > 1 ? true : false;

    let handResult = new HandResult(isWin, isQualify, bonus);

    console.log(handResult);

    return handResult;
  }

	EvalCheckBetAmount(playerCards:string[], flop:string[], river:string[]){
    if (flop.find((element) => element.includes(playerCards[0].substring(0,1)))||flop.find((element) => element.includes(playerCards[1].substring(0,1)))){
      return 2;
    }
    else if(river.find((element) => element.includes(playerCards[0].substring(0,1)))||river.find((element) => element.includes(playerCards[1].substring(0,1)))){
      return 1;
    }
    else{
      return 0;
    }
  }

	simulate( ){
		console.log( 'sim! ' );
		console.log( this.simParametersForm.value );

		const hand:string[] = [ this.simParametersForm.value.playerCards.card1, this.simParametersForm.value.playerCards.card2 ]
		const index:number[] = [
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

	async evaluateHand( hand:string[] ): Promise<PokerEvaluation> {

		let evaluation: PokerEvaluation = new PokerEvaluation();
		await new Promise<void>( (resolve, reject) => { this.pokerService.evaluateHand(hand).subscribe( {
			next: newPokerEvaluation => {
				console.log( "evaluation return: ", newPokerEvaluation );
				evaluation = newPokerEvaluation;
			},
			error: error => {
				console.log( "evaluation error: ", error );
				reject(error);
			},
			complete: () => {
				resolve();
			}
		})});

		return evaluation;
	}
}
