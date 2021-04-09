import * as PIXI from 'pixi.js';
import gsap from 'gsap';

import {View} from "../../../framework/view";
import event from "../../../framework/event";
import {GameModel} from "../../model/game-model";
import {EVENT_RENDER_GAME_OVER} from "../../util/event";
import titleStyle from "../style/title-style";

export class GameOverView extends View {
  private _gameModel: GameModel;

  private _graphics: PIXI.Graphics;
  private _gameOverText: PIXI.Text;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;

    event.addListener(EVENT_RENDER_GAME_OVER, () => {
      this.renderGameOver();
    });
  }

  public init() {
    this._graphics = new PIXI.Graphics();
    this._graphics.beginFill(0x000000, 0.5);
    this._graphics.drawRect(0, - window.innerHeight / 2, this.vw, window.innerHeight * 2);
    this._graphics.interactive = true;
    this.addChild(this._graphics);

    this._gameOverText = new PIXI.Text('Game Over', titleStyle)
    this._gameOverText.x = (this.vw - this._gameOverText.width) / 2;
    this._gameOverText.y = (this.vh - this._gameOverText.height) / 2;
    this.addChild(this._gameOverText);

    this.visible = false;
  }

  public renderGameOver() {
    this.visible = true;
  }
}
