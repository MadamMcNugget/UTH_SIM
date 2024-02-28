
export class PlayerHandSim {
  card1: string;
  card2: string;
  index: Index;
  resultsAtCount: ResultAtCount[];
  totalBasicBet: number= 0;
  totalBasicNet: number= 0;
  totalAdvancedBet:number= 0;
  totalAdvancedNet:number= 0;
  constructor(card1:string, card2:string, index:number[]){
    this.card1= card1;
    this.card2= card2;
    console.log('here2');
    this.index= new Index(index);
  }
  public win(count:ResultAtCount, bet:number, qualify:boolean, bonus:number) {

  }
  public lose(count:ResultAtCount, bet:number, qualify:boolean){

  }
}

export class Index{

  indexMap: Map <string,number>;
  trigger:number;
  basicStrategy:number;
  constructor(index:number[]){
//    if(index.length !== 13) throw new
    this.indexMap = new Map([
      ['A', index[0]],
      ['K', index[1]],
      ['Q', index[2]],
      ['J', index[3]],
      ['T', index[4]],
      ['9', index[5]],
      ['8', index[6]],
      ['7', index[7]],
      ['6', index[8]],
      ['5', index[9]],
      ['4', index[10]],
      ['3', index[11]],
      ['2', index[12]]
    ]);
     console.log(this.indexMap.get('2'));
  }
}

export class ResultAtCount{
  count:number;
  basicNet:number;
  basicBet:number;
  devianceNet:number;
  devianceBet:number;
  occurrence:number;
}

