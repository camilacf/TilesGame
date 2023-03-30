import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Player, PlayersService } from 'src/players.service';
import { InitModalComponent } from './init-modal/init-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'tiles';
  gameStarted: boolean = false;
  players: Player[] = [];

  constructor(
    public dialog: MatDialog,
    private playerService: PlayersService
  ) {}
  ngOnInit(): void {
    /*this.playerService.players.subscribe((p) => {
      if (p.length == 0) {
        this.dialog.open(InitModalComponent, { width: '500px' });
      } else {
        this.players = p;
      }
    });*/
  }
}
