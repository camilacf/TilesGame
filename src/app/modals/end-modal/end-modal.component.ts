import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InitModalComponent } from '../init-modal/init-modal.component';
import { GameService } from '../../services/game.service';
import { Player, PlayersService } from '../../services/players.service';
import { TilesService } from '../../services/tiles.service';

@Component({
  selector: 'app-end-modal',
  templateUrl: './end-modal.component.html',
  styleUrls: ['./end-modal.component.scss'],
})
export class EndModalComponent implements OnInit {
  winner: Player | undefined = { name: '', id: 0, order: 0, points: 0 };
  constructor(
    public dialogRef: MatDialogRef<InitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private playersService: PlayersService,
    private tileService: TilesService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.playersService.playersSub.subscribe((p) => {
      this.winner = this.findWinner(p);
    });
  }

  findWinner(players: Player[]) {
    let maxPoints = 0;
    let winnerInd = 0;
    for (let i = 0; i < players.length; i++) {
      if (players[i].points > maxPoints) {
        maxPoints = players[i].points;
        winnerInd = i;
      }
    }
    return players[winnerInd];
  }

  restart() {
    this.gameService.newGame();
  }
}
