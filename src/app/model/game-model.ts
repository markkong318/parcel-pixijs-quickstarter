import {Model} from "../../framework/model";

export class GameModel extends Model {
  private _score: number = 0;
  private _bet: number = 0;
  private _reels: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor() {
    super();

    for (let i = 0; i < this._reels.length; i++) {
      for (let j = 0; j < this._reels[i].length; j++) {
        this._reels[i][j] = Math.floor(Math.random() * 5);
      }
    }
  }


  public set score(score: number) {
    this._score = score;
  }

  public get score() {
    return this._score;
  }

  public set bet(bet: number) {
    this._bet = bet;
  }

  public get bet() {
    return this._bet;
  }

  public get reels() {
    return this._reels;
  }
}
