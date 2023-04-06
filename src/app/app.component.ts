import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Player, PlayersService } from 'src/app/services/players.service';
import { EndModalComponent } from './modals/end-modal/end-modal.component';
import { InitModalComponent } from './modals/init-modal/init-modal.component';
import { GameService } from './services/game.service';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { WelcomeModalComponent } from './modals/welcome-modal/welcome-modal.component';
import { DialogRef } from '@angular/cdk/dialog';

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
    private gameService: GameService,
    private playerService: PlayersService
  ) {}
  ngOnInit(): void {
    // Import the functions you need from the SDKs you need
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    const firebaseConfig = environment.config;
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    this.gameService.counted.subscribe((playersReady) => {
      if (
        this.gameService.gameState.getValue() == 2 &&
        this.players.length == playersReady
      ) {
        this.dialog.open(EndModalComponent, { width: '500px' });
      }
    });
    this.playerService.playersSub.subscribe((p) => {
      if (p.length == 0 && this.gameService.gameState.getValue() == 0) {
        const dialogRef = this.dialog.open(WelcomeModalComponent, {
          width: '60vw',
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log('Choose players');
          this.dialog.open(InitModalComponent, {
            disableClose: true,
            width: '60vw',
          });
        });
      } else {
        this.players = p;
        this.gameStarted = true;
      }
    });
  }
}
