import * as PIXI from 'pixi.js';

import {View} from "../../../framework/view";
import event from "../../../framework/event";
import {REEL_WIDTH, SYMBOL_SIZE} from "../../util/env";
import {backout, lerp, tweenTo} from "../../util/anime";
import {GameModel} from "../../model/game-model";
import {EVENT_RENDER_REELS, EVENT_UPDATE_REELS_AFTER} from "../../util/event";

export class ReelView extends View {
  private _gameModel: GameModel;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;
  }

  public init() {
    const slotTextures = [
      PIXI.Texture.from('veggies_1'),
      PIXI.Texture.from('veggies_4'),
      PIXI.Texture.from('veggies_11'),
      PIXI.Texture.from('veggies_13'),
      PIXI.Texture.from('veggies_17'),
    ];

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

      for (let j = 0; j < this._gameModel.reels[i].length; j++) {
        const symbol = new PIXI.Sprite(slotTextures[this._gameModel.reels[i][j]]);
        symbol.y = j * SYMBOL_SIZE - SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }

      reels.push(reel);
    }

    this.addChild(reelContainer);

    const tweens = [];

    let running = false;

    const startPlay = () => {
      if (running) {
        return;
      }

      running = true;

      for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        reel.position = 0;

        const target = this._gameModel.rolls[i].length;
        const time = 2500 + i * 600;
        tweenTo(tweens, reel, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);

        console.log(`${i}: ${reel.position} -> ${target}`);
      }
    }

    function reelsComplete() {
      running = false;
      event.emit(EVENT_UPDATE_REELS_AFTER);
    }

    PIXI.Ticker.shared.add((delta) => {
      for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        reel.blur.blurY = (reel.position - reel.previousPosition) * 8;
        reel.previousPosition = reel.position;

        for (let j = 0; j < reel.symbols.length; j++) {
          const symbol = reel.symbols[j];
          const prevY = symbol.y;
          symbol.y = ((reel.position + j) % reel.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
          if (symbol.y < 0 && prevY > (SYMBOL_SIZE * (reel.symbols.length - 1) - SYMBOL_SIZE)) {
            if (i == 2) {
              console.log("j: " + j + ",y:" + symbol.y + ", prevY: " +prevY+ ", position:" + reel.position + " , left:" + this._gameModel.rolls[i].length)
            }

            symbol.texture = slotTextures[this._gameModel.rolls[i].shift()];
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.texture.width, SYMBOL_SIZE / symbol.texture.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            console.log(this._gameModel.rolls);
          }
        }
      }
    });

    PIXI.Ticker.shared.add((delta) => {
      const now = Date.now();
      const remove = [];
      for (let i = 0; i < tweens.length; i++) {
        const tween = tweens[i];
        const phase = Math.min(1, (now - tween.start) / tween.time);

        tween.object[tween.property] = lerp(tween.propertyBeginValue, tween.target, tween.easing(phase));

        if (tween.change) {
          tween.change(tween)
        }

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

    event.on(EVENT_RENDER_REELS, () => {
      startPlay();
    });
  }
}
