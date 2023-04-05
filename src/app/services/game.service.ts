import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Player, PlayersService } from 'src/app/services/players.service';
import { Tile } from './tiles.service';
enum gameStates {
  play,
  countPoints,
  end,
  restart,
}
@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameState: BehaviorSubject<gameStates> = new BehaviorSubject<gameStates>(0);
  round: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  circlesQnt: number = 0;
  counted: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  gameFinished: boolean = false;

  constructor() {}

  initGame(playersNum: number) {
    this.circlesQnt = playersNum == 2 ? 5 : playersNum == 3 ? 7 : 9;
  }

  finishGame() {}

  startRound() {
    if (this.gameState.getValue() != 3) {
      this.gameState.next(gameStates.play);
      this.counted.next(0);
    }
  }

  endRound() {
    this.gameState.next(gameStates.countPoints);
  }

  endGame() {
    this.gameState.next(gameStates.end);
  }

  newGame() {
    this.gameState.next(gameStates.restart);
  }

  addPlayerCounted() {
    this.counted.next(this.counted.getValue() + 1);
  }
}
