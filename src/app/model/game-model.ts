import {Model} from "../../framework/model";

export class GameModel extends Model {
  private _score: number = 0;
  private _bet: number = 0;
  private _reels: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

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
