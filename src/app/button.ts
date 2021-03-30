import * as PIXI from 'pixi.js';

export class Button extends PIXI.Text {
  constructor(text: string, style?: any | PIXI.TextStyle, canvas?: HTMLCanvasElement) {
    if (!style) {
      style = new PIXI.TextStyle({
        fontFamily: '04b03',
        fontSize: 36,
        fontStyle: '',
        fontWeight: 'bold',
        fill: "#e8b796",
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
    }

    super(text, style, canvas);
  }
}
