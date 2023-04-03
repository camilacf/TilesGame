import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Player, PlayersService } from 'src/app/services/players.service';
import { colors, Tile, TilesService } from 'src/app/services/tiles.service';
import { Board, ConstructedLine } from './board';
import * as _ from 'lodash';
import { BoardService } from 'src/app/services/board.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.scss'],
})
export class PlayerBoardComponent implements OnInit {
  @Input() player: Player = { name: '', id: 0, order: 0, points: 0 };
  @Input() timeToCountPoints: boolean = false;
  @Output() tilesWereSelected: EventEmitter<null> = new EventEmitter<null>();
  isTurn: boolean = false;
  tilesSelected: Tile[] = [];
  board: Board = {
    playerId: 0,
    buildingLines: [],
    contructedLines: [],
    brokenLine: [],
  };

  constructor(
    private playerService: PlayersService,
    private tilesService: TilesService,
    private gameService: GameService,
    private boardService: BoardService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
    console.log('init board');
    this.board = this.boardService.initBoard(this.player);
    this.playerService.curPlayerSub.subscribe((cur) => {
      this.isTurn = cur.id == this.player.id;
    });
    this.gameService.gameState.subscribe((state) => {
      if (state == 1) {
        this.countPoints();
      }
    });
    this.tilesService.selectedTilesSub.subscribe((selected) => {
      this.tilesSelected = selected;
    });
  }

  canSelectBuilSpace(line: number): boolean {
    if (!this.board) return false;
    return (
      this.isTurn &&
      this.tilesSelected.length > 0 &&
      (!this.board.buildingLines[line].tiles.some(
        (t) => !this.boardService.isEmpty(t)
      ) ||
        this.boardService.isSameColorBuild(
          line,
          this.tilesSelected,
          this.board
        )) &&
      !this.boardService.isSameColorConstructed(
        line,
        this.tilesSelected,
        this.board
      )
    );
  }

  selectBuildSpace(line: number) {
    let selectCopy = this.tilesSelected.slice();
    if (this.board && this.canSelectBuilSpace(line)) {
      this.boardService.selectBuildSpace(line, selectCopy, this.board);
      this.tilesWereSelected.emit();
    }
  }

  selectBrokenSpace() {
    let selectCopy = this.tilesSelected.slice();
    if (this.board && this.isTurn && this.tilesSelected.length > 0) {
      this.boardService.selectBroken(selectCopy, this.board);
      this.tilesWereSelected.emit();
    }
  }

  countPoints() {
    console.log('point count');
    for (let i = 0; i < this.board.buildingLines.length; i++) {
      let colored = this.board.buildingLines[i].tiles.filter(
        (t) => t.color != 'grey'
      );
      if (colored.length == i + 1) {
        this.moveToConstructed(i, colored[0].color);
        this.board.buildingLines[i].tiles = this.board.buildingLines[
          i
        ].tiles.map((t) => ({
          color: 'grey',
          index: 0,
          selected: false,
        }));
      }
    }
    this.player.points =
      this.player.points > this.boardService.countBrokenPoints(this.board)
        ? this.player.points - this.boardService.countBrokenPoints(this.board)
        : 0;
    if (this.boardService.hasWhiteTile(this.board)) {
      this.boardService.playerWithWhite = this.player.id;
    }
    this.board.brokenLine = this.board.brokenLine.map((b) => ({
      ...b,
      tile: undefined,
    }));
    this.playerService.updatePoints(this.player.id, this.player.points);
    this.gameService.addPlayerCounted();
    if (this.boardService.playerFinishedRow) {
      this.gameService.endGame();
    }
  }

  moveToConstructed(line: number, color: string) {
    if (
      !this.board.contructedLines[line].tiles.some((t) => t.tile.color == color)
    ) {
      let col = this.boardService.findColorColumn(
        this.board.contructedLines[line].spaces,
        color
      );
      if (col >= 0) {
        this.board.contructedLines[line].tiles.push({
          tile: this.board.buildingLines[line].tiles[0],
          column: col,
        });

        this.tilesService.throwOnTrash(this.board.buildingLines[line]);

        this.player.points += this.boardService.countTilePoint(
          line,
          col,
          color,
          this.board
        );
      }
    }
  }

  isConstructedEmpty(
    constructedLine: ConstructedLine,
    space: { color: string; column: number }
  ) {
    return !constructedLine.tiles.some((t) => t.tile.color == space.color);
  }
}
