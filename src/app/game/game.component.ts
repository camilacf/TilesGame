import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { tap } from 'lodash';
import { take } from 'rxjs';
import { Player, PlayersService } from 'src/app/services/players.service';
import { BoardService } from '../services/board.service';
import { GameService } from '../services/game.service';
import { TileMovesService } from '../services/tile-moves.service';
import { Tile, TilesService } from '../services/tiles.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, AfterViewInit {
  players: Player[] = [];
  round: number = 0;
  roundTiles: Tile[][] = [];
  tableTiles: Tile[] = [];
  selectedCircleIndex: number = 0;
  countPoints: boolean = false;
  @ViewChild('spareContainer', { read: ElementRef })
  spareContainer?: ElementRef<HTMLElement>;
  @ViewChildren('spareTiles', { read: ElementRef })
  spareTiles?: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private playerService: PlayersService,
    private tilesService: TilesService,
    private tileMovesService: TileMovesService,
    private boardService: BoardService,
    private gameService: GameService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.playerService.playersSub.pipe(take(1)).subscribe((p) => {
      this.players = p;
      this.gameService.initGame(this.players.length);
    });
    this.tilesService.roundTilesSub.subscribe((tiles) => {
      this.roundTiles = tiles;
    });
    this.tilesService.spareTilesSub.subscribe((spare) => {
      this.tableTiles = spare;
    });
    this.gameService.counted.subscribe((playersReady) => {
      if (
        this.gameService.gameState.getValue() == 1 &&
        this.players.length == playersReady
      ) {
        this.playerService.updateOrder(this.boardService.playerWithWhite);
        this.gameService.startRound();
        this.initRound();
      }
    });
    this.gameService.gameState.subscribe((state) => {
      if (state == 2) {
        this.tilesService.resetTiles();
      } else if (state == 3) {
        this.gameService.initGame(this.playerService.getPlayersNum());
        this.players = [];
        this.playerService.newGame();
        setTimeout(() => {
          this.players = this.playerService.getPlayers();
          console.log(this.players);
          this.initRound();
        }, 300);
      }
    });

    this.tilesService.initTiles();
  }

  ngAfterViewInit(): void {
    if (this.players.length > 0) {
      this.initRound();
    }
    this.cdr.detectChanges();
  }

  initRound() {
    this.tilesService.drawTiles(this.gameService.circlesQnt, 4);
    this.tileMovesService.placeTiles(
      this.spareContainer,
      this.tableTiles,
      this.spareTiles,
      true
    );

    this.playerService.firstPlayerTurn();
  }

  onTileClicked(index: number, event: { color: string; select: boolean }) {
    if (event.color != 'white') {
      this.selectedCircleIndex = index;
      this.tilesService.selectTiles(index, event.color, event.select);
    }
  }

  hasIntersectionTiles(list1: Tile[], list2: Tile[]) {}

  onTilesPlaced() {
    if (this.tilesService.tilesSelectedFromCircle()) {
      this.moveToSpare();
    } else {
      this.moveFromSpare();
    }
    this.tilesService.emptySelected();
    if (this.tilesService.noMoreTiles()) {
      this.gameService.endRound();
    } else {
      this.playerService.changeTurn();
    }
  }

  moveFromSpare() {
    this.tilesService.formSpare();
  }

  moveToSpare() {
    this.tilesService.toSpare();

    setTimeout(() => {
      this.tileMovesService.placeTiles(
        this.spareContainer,
        this.tableTiles,
        this.spareTiles,
        true
      );
    }, 200);
  }
}
