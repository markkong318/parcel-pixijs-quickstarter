import * as PIXI from 'pixi.js';

import {View} from "../../framework/view";
import {Button} from "../button";
import event from "../util/event";

export class BottomView extends View {
  constructor() {
    super();
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
    playText.x = Math.round((this.viewWidth - playText.width) / 2);
    playText.y = Math.round((this.viewHeight - playText.height) / 2);
    playText.interactive = true;
    playText.buttonMode = true;
    playText.addListener('pointerdown', () => {
      event.emit('play');
    });
    this.addChild(playText);
  }
}
