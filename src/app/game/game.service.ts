import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Player, PlayersService } from 'src/players.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  round: Subject<number> = new Subject<number>();

  constructor(private playerService: PlayersService) {}

  startGame() {}

  startRound() {}

  endRound() {}
}
