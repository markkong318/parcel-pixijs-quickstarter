import {Controller} from "../../framework/controller";
import {GameModel} from "../model/game-model";
import event from "../../framework/event";
import {ONE_PLAY_BET} from "../util/env";
import {
  EVENT_CLICK_PLAY,
  EVENT_RENDER_REELS, EVENT_RENDER_SCORE,
  EVENT_UPDATE_BET,
  EVENT_UPDATE_REELS,
  EVENT_UPDATE_REELS_AFTER, EVENT_UPDATE_SCORE
} from "../util/event";
import {LINE_COLUMN, LINE_DIAGONAL_1, LINE_DIAGONAL_2, LINE_ROW} from "../util/line";

export class GameController extends Controller {
  private _gameModel: GameModel;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;

    event.on(EVENT_CLICK_PLAY, () => {
      console.log('ev click play')
      event.emit(EVENT_UPDATE_REELS);
    });

    event.on(EVENT_UPDATE_REELS, () => {
      this.updateReels();
      event.emit(EVENT_RENDER_REELS);
    });

    event.on(EVENT_UPDATE_REELS_AFTER, () => {
      this.updateReelsAfter();
      event.emit(EVENT_UPDATE_SCORE);
    });

    event.on(EVENT_UPDATE_BET, () => {

    });

    event.on(EVENT_UPDATE_SCORE, () => {
      this.updateScore();
      event.emit(EVENT_RENDER_SCORE);
    });
  }

  public clickPlay() {
    this._gameModel.playing = true;
  }

  public updateReels() {
    for (let i = 0; i < this._gameModel.reels.length; i++) {
      const size = 10 + i * 5;

      const symbols = []
      for (let j = 0; j < size; j++) {
        symbols.push(Math.floor(Math.random() * 5));
      }

      this._gameModel.reels[i] = [...symbols];
      this._gameModel.rolls[i] = [...symbols];
    }
  }

  public updateReelsAfter() {
    for (let i = 0; i < this._gameModel.rolls.length; i++) {
      const left = this._gameModel.rolls[i].length;
      if (left) {
        for (let j = 0; j < left; j++) {
          this._gameModel.reels[i].pop();
        }
      }
    }

    for (let i = 0; i < this._gameModel.reels.length; i++) {
      const reel = []
      for (let j = this._gameModel.reels[i].length - 2 ; j >= this._gameModel.reels[i].length - 4; j--) {
        reel.push(this._gameModel.reels[i][j]);
      }

      console.log(reel)

      this._gameModel.reels[i] = reel;
    }
  }

  public updateBet() {
    this._gameModel.bet -= ONE_PLAY_BET;
    this._gameModel.scoreGain = -ONE_PLAY_BET;
  }

  public updateScore() {
    const lineIds = [];

    for (let i = 0; i < this._gameModel.reels.length; i++) {
      let match = true;

      for (let j = 0; j < this._gameModel.reels[i].length - 1; j++) {
        if (this._gameModel.reels[i][j] != this._gameModel.reels[i][j + 1]) {
          match = false;
          break;
        }
      }

      if (!match) {
        continue;
      }

      lineIds.push(LINE_COLUMN[i]);
    }

    for (let i = 0; i < this._gameModel.reels[0].length; i++) {
      let match = true;

      for (let j = 0; j < this._gameModel.reels.length - 1; j++) {
        if (this._gameModel.reels[j][i] != this._gameModel.reels[j + 1][i]) {
          match = false;
          break;
        }
      }

      if (!match) {
        continue;
      }

      lineIds.push(LINE_ROW[i]);
    }

    let matchDiagonalLeft = true;
    let matchDiagonalRight = true;
    for (let i = 0; i < this._gameModel.reels.length - 1; i++) {
      if (this._gameModel.reels[i][i] != this._gameModel.reels[i + 1][i + 1]) {
        matchDiagonalLeft = false;
        break;
      }
    }

    if (matchDiagonalLeft) {
      lineIds.push(LINE_DIAGONAL_1);
    }

    for (let i = 0; i < this._gameModel.reels.length - 1; i++) {
      if (this._gameModel.reels[i][this._gameModel.reels.length - i] != this._gameModel.reels[i + 1][this._gameModel.reels.length - i - 1]) {
        matchDiagonalRight = false;
        break;
      }
    }

    if (matchDiagonalRight) {
      lineIds.push(LINE_DIAGONAL_2);
    }

    this._gameModel.lineIds = [...lineIds];

    console.log('lineIds:');
    console.log(lineIds);

    this._gameModel.scoreGain = lineIds.length * 10;
    this._gameModel.score += this._gameModel.scoreGain;
  }
}
