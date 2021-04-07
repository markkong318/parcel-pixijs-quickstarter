import * as PIXI from 'pixi.js';

import {View} from "../../../framework/view";
import event from "../../../framework/event";
import {GameModel} from "../../model/game-model";
import {EVENT_CLICK_PLAY} from "../../util/event";
import buttonStyle from "../style/button-style";

export class BottomView extends View {
  private _gameModel: GameModel;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;
  }

  public init() {
    const playText = new PIXI.Text('Spin', buttonStyle);
    playText.x = Math.round((this.vw - playText.width) / 2);
    playText.y = Math.round((this.vh - playText.height) / 2);
    playText.interactive = true;
    playText.buttonMode = true;
    playText.addListener('pointerdown', () => {
      event.emit(EVENT_CLICK_PLAY);
    });
    this.addChild(playText);
  }
}
