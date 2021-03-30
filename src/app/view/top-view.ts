import * as PIXI from 'pixi.js';

import {View} from "../../framework/view";

export class TopView extends View {
  constructor() {
    super();
  }

  public init() {
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

    const headerText = new PIXI.Text('PIXI MONSTER SLOTS!', style);
    headerText.x = Math.round((this.viewWidth - headerText.width) / 2);
    headerText.y = Math.round((this.viewHeight - headerText.height) / 2);

    // const top = new PIXI.Graphics();
    // top.beginFill(0, 1);
    // top.drawRect(0, 0, 1000, 400);
    //
    // this.addChild(top)

    // console.log(headerText.x + ',,,' + headerText.y);
    this.addChild(headerText);
    // console.log(this.getBounds());
    // console.log(this.getLocalBounds())
    // console.log(this.width)
    // console.log('drawwwww')
  }
}
