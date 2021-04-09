import {Controller} from "../../framework/controller";
import {GameModel} from "../model/game-model";
import event from "../../framework/event";
import {ONE_PLAY_BET} from "../util/env";
import {
  EVENT_CLICK_PLAY,
  EVENT_RENDER_PREPARE_PLAY,
  EVENT_RENDER_AFTER_PLAY,
  EVENT_PREPARE_PLAY,
  EVENT_AFTER_PLAY, EVENT_RENDER_GAME_OVER,
} from "../util/event";
import {LINE_COLUMN, LINE_DIAGONAL_1, LINE_DIAGONAL_2, LINE_ROW} from "../util/line";

export class GameController extends Controller {
  private _gameModel: GameModel;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;

    event.on(EVENT_CLICK_PLAY, () => {
      if (this.tryPlaying()) {
        return;
      }
      event.emit(EVENT_PREPARE_PLAY);
    });

    event.on(EVENT_PREPARE_PLAY, () => {
      this.clear();
      this.consumeBet();
      this.updateReels();
      event.emit(EVENT_RENDER_PREPARE_PLAY);
    });

    event.on(EVENT_AFTER_PLAY, () => {
      this.updateReelsAfter();
      this.updateResult();
      this.clickDone();
      event.emit(EVENT_RENDER_AFTER_PLAY);
    });
  }

  public tryPlaying() {
    if (this._gameModel.playing) {
      return true;
    }
    this._gameModel.playing = true;
  }

  public clickDone() {
    this._gameModel.playing = false;
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
      for (let j = this._gameModel.reels[i].length - 2; j >= this._gameModel.reels[i].length - 4; j--) {
        reel.push(this._gameModel.reels[i][j]);
      }

      console.log(reel)

      this._gameModel.reels[i] = reel;
    }
  }

  public consumeBet() {
    if (this._gameModel.bet < ONE_PLAY_BET) {
      this._gameModel.betGain = this._gameModel.bet;
      this._gameModel.bet = 0;

      return;
    }

    this._gameModel.bet -= ONE_PLAY_BET;
    this._gameModel.betGain = -ONE_PLAY_BET;
  }

  public clear() {
    this._gameModel.lineIds = [];
  }

  public updateResult() {
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
      console.log(i + ", " + (this._gameModel.reels.length - 1 - i) +":: " + (i + 1) + ", " + (this._gameModel.reels.length - 1 - i - 1))
      if (this._gameModel.reels[i][this._gameModel.reels.length - 1 - i] != this._gameModel.reels[i + 1][this._gameModel.reels.length - 1- i - 1]) {
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

    this._gameModel.scoreGain = lineIds.length * lineIds.length * 3 * 10;
    this._gameModel.score += this._gameModel.scoreGain;

    this._gameModel.betGain = lineIds.length * lineIds.length * 3 * 10;
    this._gameModel.bet += this._gameModel.betGain;

    if (this._gameModel.bet <= 0) {
      event.emit(EVENT_RENDER_GAME_OVER);
    }
  }
}
