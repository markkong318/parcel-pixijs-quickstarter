import {Model} from "../../framework/model";

export class GameModel extends Model {
  private _playing: boolean = false;

  private _score: number = 0;
  private _scoreGain: number = 0;
  private _bet: number = 100;
  private _betGain: number = 0;
  private _reels: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  private _rolls: number[][] = [
    [],
    [],
    [],
  ];

  private _lineIds: number[] = [];

  constructor() {
    super();

    for (let i = 0; i < this._reels.length; i++) {
      for (let j = 0; j < this._reels[i].length; j++) {
        this._reels[i][j] = Math.floor(Math.random() * 5);
      }
    }
  }

  public set playing(playing: boolean) {
    this._playing = playing;
  }

  public get playing() {
    return this._playing;
  }

  public set score(score: number) {
    this._score = score;
  }

  public get score() {
    return this._score;
  }

  public set scoreGain(scoreGain: number) {
    this._scoreGain = scoreGain;
  }

  public get scoreGain() {
    return this._scoreGain;
  }

  public set bet(bet: number) {
    this._bet = bet;
  }

  public get bet() {
    return this._bet;
  }

  public set betGain(betGain: number) {
    this._betGain = betGain;
  }

  public get betGain() {
    return this._betGain;
  }

  public set reels(reels: number[][]) {
    this._reels = reels;
  }

  public get reels() {
    return this._reels;
  }

  public set rolls(rolls: number[][]) {
    this._rolls = rolls;
  }

  public get rolls() {
    return this._rolls;
  }

  public set lineIds(lineIds: number[]) {
    this._lineIds = lineIds;
  }

  public get lineIds() {
    return this._lineIds;
  }
}
