import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Player {
  name: string;
  id: number;
  order: number;
  points: number;
}
@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  playersSub: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
  updatedPlayersList: Player[] = [];
  curPlayerSub: BehaviorSubject<Player> = new BehaviorSubject<Player>({
    name: '',
    id: 0,
    order: 0,
    points: 0,
  });
  curPlayerOrder: number = 0;

  constructor() {}

  getPlayers() {
    return this.playersSub.getValue();
  }

  getPlayersNum() {
    return this.playersSub.getValue().length;
  }

  setPlayers(playerList: Player[]) {
    this.updatedPlayersList = playerList.slice();
    console.log(this.updatedPlayersList);
    this.playersSub.next(playerList);
  }

  changeTurn() {
    let lastPlayed = this.curPlayerOrder;
    if (lastPlayed == this.getPlayersNum() - 1) {
      this.firstPlayerTurn();
    } else {
      this.curPlayerOrder = lastPlayed + 1;
      let cur = this.playersSub
        .getValue()
        .find((p) => p.order == lastPlayed + 1);
      if (cur != undefined) {
        this.curPlayerSub.next(cur);
      }
    }
  }

  newGame() {
    this.updatedPlayersList = this.updatedPlayersList.map((p) => ({
      ...p,
      point: 0,
    }));
    this.playersSub.next(this.updatedPlayersList);
  }

  firstPlayerTurn() {
    this.curPlayerOrder = 0;
    let first = this.playersSub.getValue().find((p) => p.order == 0);
    if (first != undefined) {
      this.curPlayerSub.next(first);
    }
  }

  updatePoints(playerId: number, points: number) {
    let p = this.updatedPlayersList.find((p) => p.id == playerId);
    if (p) {
      p.points = points;
    }
  }

  updateOrder(firstPlayerId: number) {
    this.updatedPlayersList = this.updatedPlayersList.map((p) => ({
      ...p,
      order: -1,
    }));
    let first = this.updatedPlayersList.findIndex((p) => p.id == firstPlayerId);
    let order = 0;
    console.log('update', first);
    for (let i = first; i < this.getPlayersNum(); i++) {
      if (this.updatedPlayersList[i].order < 0) {
        this.updatedPlayersList[i].order = order;
        if (i == this.getPlayersNum() - 1) {
          i = -1;
        }
        order++;
      } else {
        break;
      }
    }
    this.playersSub.next(this.updatedPlayersList);
  }
}
