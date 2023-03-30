import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Player {
  name: string;
  order: number;
  points: number;
}
@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  players: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([
    { name: 'Player 1', order: 0, points: 0 },
    { name: 'Player 2', order: 1, points: 0 },
  ]);
  curPlayer: Subject<Player> = new Subject<Player>();
  curPlayerOrder: number = 0;

  constructor() {}

  getPlayers() {
    return this.players.getValue();
  }

  getPlayersNum() {
    return this.players.getValue().length;
  }

  setPlayers(playerList: Player[]) {
    this.players.next(playerList);
  }

  changeTurn() {
    let lastPlayed = this.curPlayerOrder;
    if (lastPlayed == this.players.getValue().length - 1) {
      this.curPlayerOrder = 0;
      this.firstPlayerTurn();
    } else {
      this.curPlayerOrder = lastPlayed + 1;
      let cur = this.players.getValue().find((p) => p.order == lastPlayed + 1);
      if (cur != undefined) {
        this.curPlayer.next(cur);
      }
    }
  }

  firstPlayerTurn() {
    let first = this.players.getValue().find((p) => p.order == 0);
    if (first != undefined) {
      this.curPlayer.next(first);
    }
  }
}
