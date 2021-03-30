import {View} from "../../framework/view";
import {BottomView} from "./bottom-view";
import {TopView} from "./top-view";
import {ReelView} from "./reel-view";
import {SYMBOL_SIZE, REEL_WIDTH} from "../util/env";

export class GameView extends View {
  private _topView: TopView
  private _reelView: ReelView
  private _bottomView: BottomView

  constructor() {
    super();

    this._topView = new TopView();
    this._reelView = new ReelView();
    this._bottomView = new BottomView();
  }

  public init() {
    const margin = (this.viewHeight - SYMBOL_SIZE * 3) / 2;

    this._topView.x = 0;
    this._topView.y = 0;
    this._topView.viewWidth = this.viewWidth
    this._topView.viewHeight = margin;
    this._topView.init();

    console.log("width: " + this.width + ", height: " + margin);
    console.log(this.getBounds());

    this.addChild(this._topView);

    this._reelView.x = Math.round(this.viewWidth - REEL_WIDTH * 3) / 2;
    this._reelView.y = margin;
    this._reelView.init();
    this.addChild(this._reelView)


    this._bottomView.x = 0;
    this._bottomView.y = this.viewHeight - margin;
    this._bottomView.viewWidth = this.viewWidth;
    this._bottomView.viewHeight = margin;
    this._bottomView.init();
    this.addChild(this._bottomView);

  }
}
