import FontFaceObserver from 'fontfaceobserver';
import gsap from 'gsap';
import PixiPlugin from "gsap/PixiPlugin";

import {Application} from "./app/application";
import * as PIXI from 'pixi.js';

var font = new FontFaceObserver('04b03')
font.load()
  .then(() => {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    PixiPlugin.registerPIXI(PIXI);
    gsap.registerPlugin(PixiPlugin);

    const app = new Application({
      width: 480, //window.innerWidth,
      height: 800, //window.innerHeight,
    });
    document.body.appendChild(app.view);
  })


