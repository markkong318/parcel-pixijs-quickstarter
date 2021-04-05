import FontFaceObserver from 'fontfaceobserver';
import * as PIXI from 'pixi.js';

import {Application} from "./app/application";

var font = new FontFaceObserver('04b03')
font.load()
  .then(() => {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    const app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    document.body.appendChild(app.view);
  })


