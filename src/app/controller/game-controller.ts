import {Controller} from "../../framework/controller";
import {GameModel} from "../model/game-model";
import event from "../../framework/event";
import {ONE_PLAY_BET} from "../util/env";
import {
  EVENT_CLICK_PLAY,
  EVENT_RENDER_REELS,
  EVENT_UPDATE_BET,
  EVENT_UPDATE_REELS,
  EVENT_UPDATE_REELS_AFTER, EVENT_UPDATE_SCORE
} from "../util/event";

export class GameController extends Controller {
  private _gameModel: GameModel;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;

    event.on(EVENT_CLICK_PLAY, () => {
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

  }
}
