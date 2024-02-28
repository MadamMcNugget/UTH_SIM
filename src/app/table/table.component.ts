import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as PokerEvaluator from 'poker-evaluator-ts';
import { PlayerHandSim, Index,  ResultAtCount } from '../card.model'

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
  imports: [ MatTableModule, MatSortModule ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
	displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    try{
      this.dataSource.sort = this.sort;
      let deck:string[]=['As', 'Ah', 'Ac','Ad','Ks', 'Kh', 'Kc','Kd','Qs', 'Qh', 'Qc','Qd','Js', 'Jh', 'Jc','Jd', 'Ts', 'Th', 'Tc','Td','9s', '9h', '9c','9d','8s', '8h', '8c','8d','7s', '7h', '7c','7d','6s', '6h', '6c','6d','5s', '5h', '5c','5d','4s', '4h', '4c','4d','3s', '3h', '3c','3d','2s', '2h', '2c','2d'];
      let index:number[]=[2,2,-6,1,1,-6,1,1,1,1,1,1,1];
      let playerCard= new PlayerHandSim('Qs', '9h', index);

      let workingDeck:string[]= deck.filter((card)=> card !== playerCard.card1 && card!==playerCard.card2 );

      console.log("UnShuffled card is " + workingDeck);

      ShuffleArray(workingDeck);
      console.log("Shuffled card is " + workingDeck);

      let flop:string[]=workingDeck.slice(0,3);
      console.log("flop cards is " + flop);

      let river:string[]=workingDeck.slice(3,5);
      console.log("river cards is " + river);

      let deadCards:string[]=workingDeck.slice(5,15);
      console.log("Deadcards cards is " + deadCards);

      let dealerCards:string[]=workingDeck.slice(15,17);
      console.log("dealCards cards is " + dealerCards);
    }

    catch(error){

    }

    // console.log("UnShuffled card is" + shuffled);
    // ShuffleArray(shuffled);

    // console.log("Shuffled card is" + shuffled);
    // console.log(shuffled[1]);
    // let playerCard:string[]= ['As', 'Ks']
    // console.log("player cards are" + playerCard);
    // console.log("Shuffled card is" + shuffled);
    // let filteredCard:string[]= shuffled.filter((card)=> card !== playerCard[0] && card!==playerCard[1] )
    // console.log("Filtered Card is" + filteredCard);


  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


}
function ShuffleArray(array:string[]) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}
