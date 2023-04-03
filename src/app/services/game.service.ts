import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Player, PlayersService } from 'src/app/services/players.service';
import { Tile } from './tiles.service';
enum gameStates {
  play,
  countPoints,
  end,
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
    console.log('init game');
    this.circlesQnt = playersNum == 2 ? 5 : playersNum == 3 ? 7 : 9;
  }

  finishGame() {}

  startRound() {
    if (!this.gameFinished) {
      console.log('new round');
      this.gameState.next(gameStates.play);
      this.counted.next(0);
    } else {
      this.gameState.next(gameStates.end);
    }
  }

  endRound() {
    console.log('end round');
    this.gameState.next(gameStates.countPoints);
  }

  endGame() {
    this.gameFinished = true;
  }

  addPlayerCounted() {
    this.counted.next(this.counted.getValue() + 1);
  }
}
