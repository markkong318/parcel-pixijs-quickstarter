import * as PIXI from 'pixi.js';

import veggies_1 from '../assets/images/Froots N Veggies_1.png';
import veggies_4 from '../assets/images/Froots N Veggies_4.png';
import veggies_11 from '../assets/images/Froots N Veggies_11.png';
import veggies_13 from '../assets/images/Froots N Veggies_13.png';
import veggies_17 from '../assets/images/Froots N Veggies_17.png';
import {GameView} from "./view/game-view";


export class Application extends PIXI.Application {
  private _gameView;

  constructor(options?) {
    super(options);
    this.preload();
  }

  public preload(): void {
    this.loader
      .add('veggies_1', veggies_1)
      .add('veggies_4', veggies_4)
      .add('veggies_11', veggies_11)
      .add('veggies_13', veggies_13)
      .add('veggies_17', veggies_17)
      .load((loader, resources) => {
        console.log('Preload complete');
        this.onAssetsLoaded();
      });
  }

  public onAssetsLoaded(): void {
    this.initScene();
  }

  public initScene(): void {
    console.log(this.stage)
    console.log(this.renderer)

    this._gameView = new GameView();
    this._gameView.viewWidth = this.renderer.width;
    this._gameView.viewHeight = this.renderer.height;
    this._gameView.init();


    console.log("TOP: " + this.renderer.width)

    this.stage.addChild(this._gameView);
  }
}
