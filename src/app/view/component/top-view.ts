import * as PIXI from 'pixi.js';

import {View} from "../../../framework/view";
import {GameModel} from "../../model/game-model";
import {SYMBOL_SIZE} from "../../util/env";

export class TopView extends View {
  private _gameModel: GameModel;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;
  }

  public init() {
    const style = new PIXI.TextStyle({
      fontFamily: '04b03',
      fontSize: 36,
      fontStyle: '',
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

    const scoreText = new PIXI.Text('Score', style);
    scoreText.x = Math.round((this.vw - scoreText.width) / 2)  - SYMBOL_SIZE;
    scoreText.y = Math.round((this.vh) / 2);
    this.addChild(scoreText);

    const betText = new PIXI.Text('Bet', style);
    betText.x = scoreText.x;
    betText.y = 0;
    this.addChild(betText);

    const scoreField = new PIXI.Text('00000000', style);
    scoreField.x = Math.round((this.vw - scoreField.width) / 2)  + SYMBOL_SIZE * 1.4 - scoreField.width / 2;
    scoreField.y = Math.round((this.vh) / 2);
    this.addChild(scoreField);

    const betField = new PIXI.Text('000', style);
    betField.x = Math.round((this.vw - betField.width) / 2)  + SYMBOL_SIZE * 1.4 - betField.width / 2;
    betField.y = 0
    this.addChild(betField);
  }
}
