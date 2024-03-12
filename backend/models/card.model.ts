export class PlayerHandSim {
  cards: string[];
  index: Index;
  decision2:Decision[]=[];
  decision3:Decision[]=[];
  resultsAtCount: ResultAtCount[] = [];
  totalCheckBet: number= 0;
  totalCheckNet: number= 0;
  totalFourBet:number= 0;
  totalFourNet:number= 0;
  occurrence:number = 0;
  constructor(cards:string[], index:number[], decision2:Decision[], decision3:Decision[]){
    this.cards= cards;
    this.index= new Index(index);
    this.decision2 = decision2;
    this.decision3 = decision3;
  }
  public ResolveBet(count:number, checkBetAmount:number, handResult:HandResult) {
    this.occurrence++;
    // needs a fold option.
    let countIndex:number = this.resultsAtCount.findIndex((element)=> element.count == count);
    if (countIndex === -1) {
      this.resultsAtCount.push (new ResultAtCount(count))
      countIndex = this.resultsAtCount.length - 1
    }
    this.resultsAtCount[countIndex].UpdateResultAtCount(checkBetAmount, handResult)
    if (checkBetAmount === 0){

    }

    else if (handResult.isWin == 1){
      this.totalCheckBet = this.totalCheckBet + checkBetAmount + 2;
      this.totalFourBet = this.totalFourBet + 4 + 2;

      this.totalCheckNet = this.totalCheckNet + checkBetAmount + handResult.bonus;
      this.totalFourNet = this.totalFourNet + 4 + handResult.bonus;

      if (handResult.isQualify){
        this.totalCheckNet++
        this.totalFourNet++
      }
    }
    else if (handResult.isWin == -1){
      this.totalCheckBet = this.totalCheckBet + checkBetAmount + 2;
      this.totalFourBet = this.totalFourBet + 4 + 2;

      this.totalCheckNet = this.totalCheckNet - checkBetAmount -1;
      this.totalFourNet = this.totalFourNet - 4  -1;

      if (handResult.isQualify){
        this.totalCheckNet--
        this.totalFourNet--
      }

    }
    else if (handResult.isWin ==0){
      this.totalCheckBet = this.totalCheckBet + checkBetAmount + 2;
      this.totalFourBet = this.totalFourBet + 4 + 2;
    }
    else{
      throw Error;
    }
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
//     console.log(this.indexMap.get('2'));
  }
}

export class ResultAtCount{
  count:number;
  checkNet:number = 0;
  checkBet:number = 0;
  fourNet:number = 0;
  fourBet:number = 0;
  occurrence:number = 0;
  constructor(count:number) {
    this.count=count;
  }
  public UpdateResultAtCount(checkBetAmount:number, handResult:HandResult) {
    this.occurrence++

    if (handResult.isWin == 1){
      this.checkNet = this.checkNet + checkBetAmount + handResult.bonus;
      this.checkBet = this.checkBet + checkBetAmount + 2;

      this.fourNet = this.fourNet + 4 + handResult.bonus;
      this.fourBet = this.fourBet + 4 + 2;
      if (handResult.isQualify){
        this.checkNet++
        this.fourNet++
      }
    }
    else if (handResult.isWin == -1){
      this.checkBet = this.checkBet + checkBetAmount + 2;
      this.fourBet = this.fourBet + 4 + 2;

      this.checkNet = this.checkNet - checkBetAmount -1;
      this.fourNet = this.fourNet - 4  -1;

      if (handResult.isQualify){
        this.checkNet--
        this.fourNet--
      }
    }
    else if (handResult.isWin ==0){
      this.checkBet = this.checkBet + checkBetAmount + 2;
      this.fourBet = this.fourBet + 4 + 2;
    }
  }
}

export class HandResult{
  isWin:number;
  isQualify:boolean;
  bonus:number;
  constructor(isWin:number, isQualify:boolean, bonus:number){
    this.isWin = isWin;
    this.isQualify = isQualify;
    this.bonus = bonus;

  }
}

export class PokerEvaluation{
	handType: number;
	handRank: number;
	value: number;
	handName: string;
	constructor( ){
	}
}

export class Decision{
  handtype: number;
  value: number;
}
