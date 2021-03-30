import FontFaceObserver from 'fontfaceobserver';
import * as PIXI from 'pixi.js';

import {GameApp} from "./app/app";
import {Application} from "./app/application";


var font = new FontFaceObserver('04b03')
font.load()
  .then(() => {
    // const myGame = new GameApp(document.body,  window.innerWidth, window.innerHeight);


    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    const app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    document.body.appendChild(app.view);
  })


