import FontFaceObserver from 'fontfaceobserver';

import {GameApp} from "./app/app";

var font = new FontFaceObserver('04b_03')
font.load()
    .then(() => {
        const myGame = new GameApp(document.body,  window.innerWidth, window.innerHeight);
    })


