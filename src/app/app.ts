// import { bomberFrames } from '../assets/loader';
import * as PIXI from 'pixi.js';

import veggies_1 from '../assets/images/Froots N Veggies_1.png';
import veggies_4 from '../assets/images/Froots N Veggies_4.png';
import veggies_11 from '../assets/images/Froots N Veggies_11.png';
import veggies_13 from '../assets/images/Froots N Veggies_13.png';
import veggies_17 from '../assets/images/Froots N Veggies_17.png';


import {Button} from "./button";

export class GameApp {
  private app: PIXI.Application;

  constructor(parent: HTMLElement, width: number, height: number) {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    const app = new PIXI.Application({width, height, backgroundColor: 0x1099bb});

    document.body.appendChild(app.view);

    app.loader
      .add('veggies_1', veggies_1)
      .add('veggies_4', veggies_4)
      .add('veggies_11', veggies_11)
      .add('veggies_13', veggies_13)
      .add('veggies_17', veggies_17)
      .load(onAssetsLoaded);

    const REEL_WIDTH = 160;
    const SYMBOL_SIZE = 150;

    function onAssetsLoaded() {
      // Create different slot symbols.
      const slotTextures = [
        PIXI.Texture.from('veggies_1'),
        PIXI.Texture.from('veggies_4'),
        PIXI.Texture.from('veggies_11'),
        PIXI.Texture.from('veggies_13'),
        PIXI.Texture.from('veggies_17'),
      ];

      // Build the reels
      const reels = [];
      const reelContainer = new PIXI.Container();
      for (let i = 0; i < 3; i++) {
        const rc = new PIXI.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        const reel = {
          container: rc,
          symbols: [],
          position: 0,
          previousPosition: 0,
          blur: new PIXI.filters.BlurFilter(),
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        // Build the symbols
        for (let j = 0; j < 4; j++) {
          const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
          // Scale the symbol to fit symbol area.
          symbol.y = j * SYMBOL_SIZE;
          symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
          symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
          reel.symbols.push(symbol);
          rc.addChild(symbol);
        }
        reels.push(reel);
      }
      app.stage.addChild(reelContainer);

      // Build top & bottom covers and position reelContainer
      const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
      reelContainer.y = margin;
      reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 3) / 2;
      const top = new PIXI.Graphics();
      top.beginFill(0, 1);
      top.drawRect(0, 0, app.screen.width, margin);
      const bottom = new PIXI.Graphics();
      bottom.beginFill(0x684856, 1);
      bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

      // Add play text
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

      // const playText = new PIXI.Text('Spin the wheels!', style);
      const playText = new Button('Spin');
      playText.x = Math.round((bottom.width - playText.width) / 2);
      playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
      bottom.addChild(playText);

      // Add header text
      const headerText = new PIXI.Text('PIXI MONSTER SLOTS!', style);
      headerText.x = Math.round((top.width - headerText.width) / 2);
      headerText.y = Math.round((margin - headerText.height) / 2);
      top.addChild(headerText);

      app.stage.addChild(top);
      app.stage.addChild(bottom);

      // Set the interactivity.
      bottom.interactive = true;
      bottom.buttonMode = true;
      bottom.addListener('pointerdown', () => {
        startPlay();
      });

      let running = false;

      // Function to start playing.
      function startPlay() {
        if (running) return;
        running = true;

        for (let i = 0; i < reels.length; i++) {
          const reel = reels[i];
          const extra = Math.floor(Math.random() * 3);
          const target = reel.position + 10 + i * 5 + extra;
          const time = 2500 + i * 600 + extra * 600;
          tweenTo(reel, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);

          console.log(`${i}: ${reel.position} -> ${target}`);
        }
      }

      // Reels done handler.
      function reelsComplete() {
        running = false;
      }

      // Listen for animate update.
      app.ticker.add((delta) => {
        // Update the slots.
        for (let i = 0; i < reels.length; i++) {
          const reel = reels[i];
          // Update blur filter y amount based on speed.
          // This would be better if calculated with time in mind also. Now blur depends on frame rate.
          reel.blur.blurY = (reel.position - reel.previousPosition) * 8;
          reel.previousPosition = reel.position;

          // Update symbol positions on reel.
          for (let j = 0; j < reel.symbols.length; j++) {
            const symbol = reel.symbols[j];
            const prevY = symbol.y;
            symbol.y = ((reel.position + j) % reel.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
            if (symbol.y < 0 && prevY > SYMBOL_SIZE) {
              // Detect going over and swap a texture.
              // This should in proper product be determined from some logical reel.
              symbol.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
              symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.texture.width, SYMBOL_SIZE / symbol.texture.height);
              symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            }
          }
        }
      });
    }


    const tweens = [];

    function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
      const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
      };

      tweens.push(tween);
      return tween;
    }

// Listen for animate update.
    app.ticker.add((delta) => {
      const now = Date.now();
      const remove = [];
      for (let i = 0; i < tweens.length; i++) {
        const tween = tweens[i];
        const phase = Math.min(1, (now - tween.start) / tween.time);

        tween.object[tween.property] = lerp(tween.propertyBeginValue, tween.target, tween.easing(phase));

        if (tween.change) tween.change(tween);
        if (phase === 1) {
          tween.object[tween.property] = tween.target;
          if (tween.complete) {
            tween.complete(tween);
          }
          remove.push(tween);
        }
      }
      for (let i = 0; i < remove.length; i++) {
        tweens.splice(tweens.indexOf(remove[i]), 1);
      }
    });
  }
}


// Basic lerp funtion.
function lerp(a1, a2, t) {
  return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount) {
  return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}
