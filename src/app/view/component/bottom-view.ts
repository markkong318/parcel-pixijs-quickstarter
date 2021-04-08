import * as PIXI from 'pixi.js';
import gsap from 'gsap';

import {View} from "../../../framework/view";
import event from "../../../framework/event";
import {GameModel} from "../../model/game-model";
import {EVENT_CLICK_PLAY} from "../../util/event";
import buttonStyle from "../style/button-style";

export class BottomView extends View {
  private _gameModel: GameModel;

  private _graphics: PIXI.Graphics;
  private _playText: PIXI.Text;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;
  }

  public init() {
    this._graphics = new PIXI.Graphics();
    this._graphics.beginFill(0x000000);
    this._graphics.drawRect(0, 0, this.vw, this.vh);
    this.addChild(this._graphics);

    this._playText = new PIXI.Text('Spin', buttonStyle);
    this._playText.anchor.x = 0.5;
    this._playText.anchor.y = 0.5;
    this._playText.x = Math.round(this.vw / 2);
    this._playText.y = Math.round(this._playText.height / 2);

    this._graphics.interactive = true;
    this._graphics.buttonMode = true;
    this._graphics.addListener('pointerdown', () => {
      gsap.timeline()
        .clear()
        .to(this._playText,
          {
            duration: 0.2,
            pixi: {
              scaleX: 2,
              scaleY: 2,
            }
          }
        ).to(this._playText,
        {
          duration: 0.2,
          pixi: {
            scaleX: 1,
            scaleY: 1,
          }
        }
      );

      event.emit(EVENT_CLICK_PLAY);
    });
    this.addChild(this._playText);
  }
}
