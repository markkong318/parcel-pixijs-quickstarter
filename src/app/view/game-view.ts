import {View} from "../../framework/view";
import {BottomView} from "./component/bottom-view";
import {TopView} from "./component/top-view";
import {ReelView} from "./component/reel-view";
import {SYMBOL_SIZE, REEL_WIDTH} from "../util/env";
import {GameModel} from "../model/game-model";
import {GameOverView} from "./component/game-over-view";

export class GameView extends View {
  private _gameModel: GameModel;

  private _topView: TopView;
  private _reelView: ReelView;
  private _bottomView: BottomView;
  private _gameOverView: GameOverView;

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;
  }

  public init() {
    const margin = (this.vh - SYMBOL_SIZE * 3) / 2;

    this._reelView = new ReelView(this._gameModel);
    this._reelView.x = Math.round(this.vw - REEL_WIDTH * 3) / 2;
    this._reelView.y = margin;
    this._reelView.init();
    this.addChild(this._reelView)

    this._topView = new TopView(this._gameModel);
    this._topView.x = 0;
    this._topView.y = 0;
    this._topView.vw = this.vw
    this._topView.vh = margin;
    this._topView.init();
    this.addChild(this._topView);

    this._bottomView = new BottomView(this._gameModel);
    this._bottomView.x = 0;
    this._bottomView.y = this.vh - margin;
    this._bottomView.vw = this.vw;
    this._bottomView.vh = margin;
    this._bottomView.init();
    this.addChild(this._bottomView);

    this._gameOverView = new GameOverView(this._gameModel);
    this._gameOverView.x = 0;
    this._gameOverView.y = 0;
    this._gameOverView.vw = this.vw;
    this._gameOverView.vh = this.vh;
    this._gameOverView.init();
    this.addChild(this._gameOverView);
  }
}
