import * as PIXI from 'pixi.js';

import {View} from "../../../framework/view";
import event from "../../../framework/event";
import {LINE_BORDER_COLOR, LINE_COLOR, REEL_WIDTH, SYMBOL_SIZE} from "../../util/env";
import {backout, lerp, tweenTo} from "../../util/anime";
import {GameModel} from "../../model/game-model";
import {EVENT_RENDER_PREPARE_PLAY, EVENT_RENDER_AFTER_PLAY, EVENT_AFTER_PLAY} from "../../util/event";
import {
  LINE_COLUMN_1,
  LINE_COLUMN_2,
  LINE_COLUMN_3,
  LINE_DIAGONAL_1, LINE_DIAGONAL_2,
  LINE_ROW_1,
  LINE_ROW_2,
  LINE_ROW_3
} from "../../util/line";

export class ReelView extends View {
  private _gameModel: GameModel;

  private _running: boolean = false;
  private _tweens: any = [];
  private _reels: any = [];
  private _graphics: PIXI.Graphics;

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

    this._reels = [];
    const reelContainers = new PIXI.Container();
    for (let i = 0; i < 3; i++) {
      const reelContainer = new PIXI.Container();
      reelContainer.x = i * REEL_WIDTH;
      reelContainers.addChild(reelContainer);

      const reel = {
        container: reelContainer,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new PIXI.filters.BlurFilter(),
      };

      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      reelContainer.filters = [reel.blur];

      for (let j = 0; j < this._gameModel.reels[i].length; j++) {
        const symbol = new PIXI.Sprite(slotTextures[this._gameModel.reels[i][j]]);
        symbol.y = j * SYMBOL_SIZE - SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        reel.symbols.push(symbol);
        reelContainer.addChild(symbol);
      }

      this._reels.push(reel);
    }

    this.addChild(reelContainers);

    this._graphics = new PIXI.Graphics();
    this.addChild(this._graphics);

    this._tweens = [];
    this._running = false;

    PIXI.Ticker.shared.add((delta) => {
      for (let i = 0; i < this._reels.length; i++) {
        const reel = this._reels[i];
        reel.blur.blurY = (reel.position - reel.previousPosition) * 8;
        reel.previousPosition = reel.position;

        for (let j = 0; j < reel.symbols.length; j++) {
          const symbol = reel.symbols[j];
          const prevY = symbol.y;
          symbol.y = ((reel.position + j) % reel.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
          if (symbol.y < 0 && prevY > (SYMBOL_SIZE * (reel.symbols.length - 1) - SYMBOL_SIZE)) {
            // if (i == 2) {
            //   console.log("j: " + j + ",y:" + symbol.y + ", prevY: " +prevY+ ", position:" + reel.position + " , left:" + this._gameModel.rolls[i].length)
            // }

            symbol.texture = slotTextures[this._gameModel.rolls[i].shift()];
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.texture.width, SYMBOL_SIZE / symbol.texture.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            // console.log(this._gameModel.rolls);
          }
        }
      }
    });

    PIXI.Ticker.shared.add((delta) => {
      const now = Date.now();
      const remove = [];
      for (let i = 0; i < this._tweens.length; i++) {
        const tween = this._tweens[i];
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
        this._tweens.splice(this._tweens.indexOf(remove[i]), 1);
      }
    });

    event.on(EVENT_RENDER_PREPARE_PLAY, () => {
      this.renderLine();
      this.renderReels();
    });

    event.on(EVENT_RENDER_AFTER_PLAY, () => {
      this.renderLine();
    })
  }

  public renderReels() {
    if (this._running) {
      return;
    }

    this._running = true;

    for (let i = 0; i < this._reels.length; i++) {
      const reel = this._reels[i];
      reel.position = 0;

      const target = this._gameModel.rolls[i].length;
      const time = 2500 + i * 600;
      tweenTo(this._tweens, reel, 'position', target, time, backout(0.5), null, i === this._reels.length - 1 ? this.renderReelsComplete.bind(this) : null);

      console.log(`${i}: ${reel.position} -> ${target}`);
    }
  }

  public renderReelsComplete() {
    this._running = false;
    event.emit(EVENT_AFTER_PLAY);
  }

  public renderLine() {
    this._graphics.clear()

    const lineIds = this._gameModel.lineIds;

    for (let i = 0; i < lineIds.length; i++) {
      const lineId = lineIds[i];

      switch (lineId) {
        case LINE_ROW_1:
          this._graphics.lineStyle(7, LINE_BORDER_COLOR);
          this._graphics.moveTo(-1, SYMBOL_SIZE / 2 + 1);
          this._graphics.lineTo(REEL_WIDTH  * 3 - 1, SYMBOL_SIZE / 2 + 1);

          this._graphics.lineStyle(5, LINE_COLOR);
          this._graphics.moveTo(0, SYMBOL_SIZE / 2);
          this._graphics.lineTo(REEL_WIDTH  * 3, SYMBOL_SIZE / 2);
          break;

        case LINE_ROW_2:
          this._graphics.lineStyle(7, LINE_BORDER_COLOR);
          this._graphics.moveTo(-1, SYMBOL_SIZE * 3 / 2 + 1);
          this._graphics.lineTo(REEL_WIDTH  * 3 - 1, SYMBOL_SIZE * 3 / 2 + 1);

          this._graphics.lineStyle(5, LINE_COLOR);
          this._graphics.moveTo(0, SYMBOL_SIZE * 3 / 2);
          this._graphics.lineTo(REEL_WIDTH  * 3, SYMBOL_SIZE * 3 / 2);
          break;

        case LINE_ROW_3:
          this._graphics.lineStyle(7, LINE_BORDER_COLOR);
          this._graphics.moveTo(-1, SYMBOL_SIZE * 5 / 2 + 1);
          this._graphics.lineTo(REEL_WIDTH  * 3 - 1, SYMBOL_SIZE * 5 / 2 + 1);

          this._graphics.lineStyle(5, LINE_COLOR);
          this._graphics.moveTo(0, SYMBOL_SIZE * 5 / 2);
          this._graphics.lineTo(REEL_WIDTH  * 3, SYMBOL_SIZE * 5 / 2);
          break;

        case LINE_COLUMN_1:
          this._graphics.lineStyle(7, LINE_BORDER_COLOR);
          this._graphics.moveTo(REEL_WIDTH / 2 - 1, - 1);
          this._graphics.lineTo(REEL_WIDTH / 2 - 1, SYMBOL_SIZE * 3 - 1);

          this._graphics.lineStyle(5, LINE_COLOR);
          this._graphics.moveTo(REEL_WIDTH / 2, 0);
          this._graphics.lineTo(REEL_WIDTH / 2, SYMBOL_SIZE * 3);
          break;

        case LINE_COLUMN_2:
          this._graphics.lineStyle(7, LINE_BORDER_COLOR);
          this._graphics.moveTo(REEL_WIDTH * 3 / 2 - 1, - 1);
          this._graphics.lineTo(REEL_WIDTH * 3 / 2 - 1, SYMBOL_SIZE * 3 - 1);

          this._graphics.lineStyle(5, LINE_COLOR);
          this._graphics.moveTo(REEL_WIDTH * 3 / 2, 0);
          this._graphics.lineTo(REEL_WIDTH * 3 / 2, SYMBOL_SIZE * 3);
          break;

        case LINE_COLUMN_3:
          this._graphics.lineStyle(7, LINE_BORDER_COLOR);
          this._graphics.moveTo(REEL_WIDTH * 5 / 2 - 1, - 1);
          this._graphics.lineTo(REEL_WIDTH * 5 / 2 - 1, SYMBOL_SIZE * 3 - 1);

          this._graphics.lineStyle(5, LINE_COLOR);
          this._graphics.moveTo(REEL_WIDTH * 5 / 2, 0);
          this._graphics.lineTo(REEL_WIDTH * 5 / 2, SYMBOL_SIZE * 3);
          break;

        case LINE_DIAGONAL_1:
          this._graphics.lineStyle(7, LINE_BORDER_COLOR);
          this._graphics.moveTo(- 1, - 1);
          this._graphics.lineTo(REEL_WIDTH * 3 - 1, SYMBOL_SIZE * 3 - 1);

          this._graphics.lineStyle(5, LINE_COLOR);
          this._graphics.moveTo(-1, -1);
          this._graphics.lineTo(REEL_WIDTH * 3 - 1, SYMBOL_SIZE * 3 - 1);
          break;

        case LINE_DIAGONAL_2:
          this._graphics.lineStyle(7, 0xffffff);
          this._graphics.moveTo(REEL_WIDTH * 3 - 1, - 1);
          this._graphics.lineTo(-1, SYMBOL_SIZE * 3 - 1);

          this._graphics.lineStyle(5, LINE_COLOR);
          this._graphics.moveTo(REEL_WIDTH * 3 - 1, - 1);
          this._graphics.lineTo(-1, SYMBOL_SIZE * 3 - 1);
          break;
      }
    }
  }
}
