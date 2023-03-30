import { Component, Input } from '@angular/core';
import { Player, PlayersService } from 'src/players.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  players: Player[];
  constructor(private playerService: PlayersService) {
    this.players = this.playerService.getPlayers();
  }
}
