import * as PIXI from 'pixi.js';

import {View} from "../../../framework/view";
import {Button} from "../../button";
import event from "../../../framework/event";
import {GameModel} from "../../model/game-model";

export class BottomView extends View {
  private _gameModel: GameModel;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;
  }

  public init() {
    const EE = new PIXI.utils.EventEmitter();

    const style = new PIXI.TextStyle({
      fontFamily: '04b03',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
    });


    const playText = new Button('Spin');
    playText.x = Math.round((this.vw - playText.width) / 2);
    playText.y = Math.round((this.vh - playText.height) / 2);
    playText.interactive = true;
    playText.buttonMode = true;
    playText.addListener('pointerdown', () => {
      event.emit('play');
    });
    this.addChild(playText);
  }
}
