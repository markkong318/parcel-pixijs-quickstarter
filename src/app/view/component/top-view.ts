import * as PIXI from 'pixi.js';
import gsap from 'gsap';

import {View} from "../../../framework/view";
import {GameModel} from "../../model/game-model";
import {SYMBOL_SIZE} from "../../util/env";
import event from "../../../framework/event";
import {EVENT_RENDER_AFTER_PLAY, EVENT_RENDER_PREPARE_PLAY} from "../../util/event";
import titleStyle from "../style/title-style";

export class TopView extends View {
  private _gameModel: GameModel;

  private _scoreText: PIXI.Text;
  private _betText: PIXI.Text;
  private _scoreField: PIXI.Text;
  private _scoreGainField: PIXI.Text;
  private _betField: PIXI.Text;
  private _betGainField: PIXI.Text;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;
  }

  public init() {
    this._scoreText = new PIXI.Text('Score', titleStyle);
    this._scoreText.x = Math.round((this.vw - this._scoreText.width) / 2)  - SYMBOL_SIZE;
    this._scoreText.y = Math.round((this.vh) / 2);
    this.addChild(this._scoreText);

    this._betText = new PIXI.Text('Bet', titleStyle);
    this._betText.x = this._scoreText.x;
    this._betText.y = 0;
    this.addChild(this._betText);

    this._scoreField = new PIXI.Text(`${this._gameModel.score}`, titleStyle);
    this._scoreField.x = Math.round((this.vw - this._scoreField.width) / 2)  + SYMBOL_SIZE * 0.9 - this._scoreField.width / 2;
    this._scoreField.y = Math.round((this.vh) / 2);
    this.addChild(this._scoreField);

    this._scoreGainField = new PIXI.Text('', titleStyle);
    this._scoreGainField.x = Math.round((this.vw - this._scoreGainField.width) / 2)  + SYMBOL_SIZE * 1.4 - this._scoreGainField.width / 2;
    this._scoreGainField.y = Math.round((this.vh) / 2);
    this.addChild(this._scoreGainField);

    this._betField = new PIXI.Text(`${this._gameModel.bet}`, titleStyle);
    this._betField.x = Math.round((this.vw - this._betField.width) / 2)  + SYMBOL_SIZE * 0.9 - this._betField.width / 2;
    this._betField.y = 0
    this.addChild(this._betField);

    this._betGainField = new PIXI.Text('', titleStyle);
    this._betGainField.x = Math.round((this.vw - this._betGainField.width) / 2)  + SYMBOL_SIZE * 1.4 - this._betGainField.width / 2;
    this._betGainField.y = 0
    this.addChild(this._betGainField);

    event.on(EVENT_RENDER_AFTER_PLAY, () => {
      this.renderScoreGain();
      this.renderBetGain();
    });

    event.on(EVENT_RENDER_PREPARE_PLAY, () => {
      this.renderBetGain();
    });
  }

  public renderBetGain() {
    if (this._gameModel.betGain == 0) {
      this._betGainField.text = '';
      return;
    }

    const update = (ratio: number) => {
      const gain = Math.floor((1 - ratio) * this._gameModel.betGain);

      this._betField.text = `${this._gameModel.bet - gain}`;
      this._betField.x = Math.round((this.vw - this._betField.width) / 2)  + SYMBOL_SIZE * 0.9 - this._betField.width / 2;

      this._betGainField.text = `${this._gameModel.betGain > 0 ? '+' : ''}${gain}`;
      this._betGainField.x = Math.round((this.vw - this._betGainField.width) / 2)  + SYMBOL_SIZE * 1.4 - this._betGainField.width / 2;
    }

    const done = () => {
      this._betGainField.text = '';
    }

    if (this._gameModel.betGain > 0) {
      gsap
        .timeline()
        .to({},
          {
            duration: 0.5,
            onStart: function () {
              update(0)
            }
          })
        .to({},
          {
            duration: 0.5,
            onUpdate: function () {
              update(this.ratio);
            },
          })
        .to({}, {
          duration: 0.5,
          onComplete: function (that) {
            done();
          }
        });
    } else {
      gsap
        .timeline()
        .to({},
          {
            duration: 0.5,
            onStart: function () {
              update(0);
            },
            onComplete: function() {
              update(1);
              done();
            }
          })
    }
  }

  public renderScoreGain() {
    if (this._gameModel.scoreGain == 0) {
      this._scoreGainField.text = '';
      return;
    }

    const update = (ratio: number) => {
      const gain = Math.floor((1 - ratio) * this._gameModel.scoreGain);

      this._scoreField.text = `${this._gameModel.score - gain}`;
      this._scoreField.x = Math.round((this.vw - this._scoreField.width) / 2)  + SYMBOL_SIZE * 0.9 - this._scoreField.width / 2;

      this._scoreGainField.text = `${this._gameModel.scoreGain > 0 ? '+' : ''}${gain}`;
      this._scoreGainField.x = Math.round((this.vw - this._scoreGainField.width) / 2)  + SYMBOL_SIZE * 1.4 - this._scoreGainField.width / 2;
    }

    const done = () => {
      this._scoreGainField.text = '';
    }

    gsap
      .timeline()
      .to({},
        {
          duration: 0.5,
          onStart: function () {
            update(0)
          }
        })
      .to({},
      {
        duration: 0.5,
        onUpdate: function () {
          update(this.ratio);
        },
      })
      .to({}, {
        duration: 0.5,
        onComplete: function(that) {
          done();
        }
      });
  }
}
