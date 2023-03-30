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
import { Player } from 'src/players.service';
import { colors, Tile } from '../../tiles/tile';
import { TilesService } from '../../tiles/tiles.service';
import { Board, ConstructedLine } from './board';
import * as _ from 'lodash';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.scss'],
})
export class PlayerBoardComponent implements OnInit, OnChanges {
  @Input() player: Player = { name: '', order: 0, points: 0 };
  @Input() tilesSelected: Tile[] = [];
  @Input() isTurn: boolean = false;
  @Input() timeToCountPoints: boolean = false;
  @Output() tilesWereSelected: EventEmitter<null> = new EventEmitter<null>();
  board: Board = {
    player: '',
    buildingLines: [],
    contructedLines: [],
    brokenLine: [],
  };

  constructor(
    private tilesService: TilesService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.board = {
      player: this.player.name,
      buildingLines: Array(5)
        .fill(0)
        .map((x, i) => {
          return {
            spaceQuantity: i + 1,
            tiles: Array(i + 1)
              .fill(0)
              .map((e) => ({
                color: 'grey',
                index: 0,
                selected: false,
              })),
          };
        }),
      contructedLines: Array(5)
        .fill(5)
        .map((x, i) => {
          return {
            index: i,
            spaces: Array(x)
              .fill(0)
              .map((y, j) => {
                return { color: colors[(i + j) % 5], column: j + 1 };
              }),
            tiles: [],
          };
        }),
      brokenLine: Array(7)
        .fill(0)
        .map((x, i) => {
          if (i <= 1) {
            return { pointLoss: 1 };
          } else if (i <= 4) {
            return { pointLoss: 2 };
          } else {
            return { pointLoss: 3 };
          }
        }),
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.timeToCountPoints) {
      this.countPoints();
    }
  }

  isEmpty(t: Tile) {
    return t.color == 'grey';
  }

  buildAuxArray(len: number | undefined) {
    if (!len) return;
    return [...Array(len).keys()];
  }

  canSelectBuilSpace(line: number): boolean {
    if (!this.board) return false;
    return (
      this.isTurn &&
      this.tilesSelected.length > 0 &&
      (!this.board.buildingLines[line].tiles.some((t) => !this.isEmpty(t)) ||
        this.isSameColorBuild(line))
    );
  }

  isSameColorBuild(line: number) {
    let curColor =
      this.tilesSelected[0].color != 'white'
        ? this.tilesSelected[0].color
        : this.tilesSelected[1].color;
    return this.board.buildingLines[line].tiles[0].color == curColor;
  }

  selectBuildSpace(line: number) {
    let selectCopy = this.tilesSelected.slice();
    let hasWhite = false;
    if (this.board && this.canSelectBuilSpace(line)) {
      let firstEmpty = this.board.buildingLines[line].tiles.findIndex((t) =>
        this.isEmpty(t)
      );
      let emptyQnt = this.board.buildingLines[line].tiles.filter((t) =>
        this.isEmpty(t)
      ).length;
      for (
        let i = firstEmpty;
        i < firstEmpty + emptyQnt + (hasWhite ? 1 : 0);
        i++
      ) {
        if (selectCopy.length > 0) {
          let currTile = selectCopy.splice(0, 1)[0];
          if (currTile.color != 'white') {
            this.board.buildingLines[line].tiles[hasWhite ? i - 1 : i].color =
              currTile.color;
            this.board.buildingLines[line].tiles[hasWhite ? i - 1 : i].index =
              currTile.index;
          } else {
            hasWhite = true;
            let lastBroken = this.board.brokenLine.findIndex((s) => !!s.tile);
            this.board.brokenLine[lastBroken + 1].tile = currTile;
          }
        }
      }
      if (selectCopy.length > 0) {
        selectCopy.forEach((curTile) => {
          let lastBroken = this.board.brokenLine.findIndex((s) => !!s.tile);
          this.board.brokenLine[lastBroken + 1].tile = curTile;
        });
      }
      this.tilesWereSelected.emit(null);
    }
  }

  selectBrokenSpace() {
    let selectCopy = this.tilesSelected.slice();
    if (this.board && this.isTurn && this.tilesSelected.length > 0) {
      let firstEmpty = this.board.brokenLine.findIndex(
        (t) => t.tile == undefined
      );
      let emptyQnt = this.board.brokenLine.filter(
        (t) => t.tile == undefined
      ).length;
      for (let i = firstEmpty; i < firstEmpty + emptyQnt; i++) {
        if (selectCopy.length > 0) {
          let currTile = selectCopy.splice(0, 1)[0];
          this.board.brokenLine[i].tile = { ...currTile, selected: false };
        }
      }
      this.tilesWereSelected.emit(null);
    }
  }

  countPoints() {
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
    this.player.points -= this.countBrokenPoints();
  }

  moveToConstructed(line: number, color: string) {
    if (
      !this.board.contructedLines[line].tiles.some((t) => t.tile.color == color)
    ) {
      let col = this.findColorColumn(
        this.board.contructedLines[line].spaces,
        color
      );
      console.log('move');
      if (col >= 0) {
        this.board.contructedLines[line].tiles.push({
          tile: this.board.buildingLines[line].tiles[0],
          column: col,
        });
        console.log(
          this.player.points,
          this.countTilePoint(line, col, color),
          this.countBrokenPoints()
        );
        this.player.points += this.countTilePoint(line, col, color);
      }
    }
  }

  findColorColumn(
    constructedSpaces: { color: string; column: number }[],
    color: string
  ): number {
    return constructedSpaces.find((s) => s.color == color)?.column || -1;
  }

  isConstructedEmpty(
    constructedLine: ConstructedLine,
    space: { color: string; column: number }
  ) {
    return !constructedLine.tiles.some((t) => t.tile.color == space.color);
  }

  countTilePoint(line: number, column: number, color: string) {
    return (
      1 +
      this.findAdjacentTiles(line, column) +
      this.checkColumnFull(column) +
      this.checkRowFull(line) +
      this.checkColorFull(color)
    );
  }

  checkColumnFull(column: number) {
    return this.board.contructedLines.filter((ts) =>
      ts.tiles.some((t) => t.column == column)
    ).length == 5
      ? 7
      : 0;
  }

  checkRowFull(line: number) {
    return this.board.contructedLines[line].tiles.length == 5 ? 2 : 0;
  }

  checkColorFull(color: string) {
    return this.board.contructedLines.filter((line) =>
      line.tiles.some((t) => t.tile.color == color)
    ).length == 5
      ? 10
      : 0;
  }

  findAdjacentTiles(line: number, column: number) {
    let points = 0;
    for (let i = column + 1; i < 5; i++) {
      if (this.board.contructedLines[line].tiles.find((t) => t.column == i)) {
        points++;
      } else {
        break;
      }
    }
    for (let i = column - 1; i > -1; i--) {
      if (this.board.contructedLines[line].tiles.find((t) => t.column == i)) {
        points++;
      } else {
        break;
      }
    }
    for (let i = line + 1; i < 5; i++) {
      if (this.board.contructedLines[i].tiles.find((t) => t.column == column)) {
        points++;
      } else {
        break;
      }
    }
    for (let i = line - 1; i > -1; i--) {
      if (this.board.contructedLines[i].tiles.find((t) => t.column == column)) {
        points++;
      } else {
        break;
      }
    }
    return points;
  }

  countBrokenPoints() {
    let points = 0;
    this.board.brokenLine.forEach((s) => {
      if (s.tile != undefined) {
        points += s.pointLoss;
      }
    });
    return points;
  }
}
