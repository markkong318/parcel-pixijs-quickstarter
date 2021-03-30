import {Controller} from "../../framework/controller";
import {GameModel} from "../model/game-model";

export class GameController extends Controller {
  private _gameModel

  constructor(gameModel: GameModel) {
    super();

    this._gameModel = gameModel;
  }

  public play() {

  }
}
