import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board } from '../game/table/player-board/board';
import { Player } from './players.service';
import { colors, Tile } from './tiles.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  playerWithWhite: number = 0;
  playerFinishedRow: boolean = false;
  constructor() {}

  initBoard(player: Player) {
    return {
      playerId: player.id,
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

  getCurColor(tilesSelected: Tile[]) {
    return tilesSelected[0].color != 'white'
      ? tilesSelected[0].color
      : tilesSelected[1].color;
  }

  isSameColorBuild(line: number, tilesSelected: Tile[], board: Board) {
    let curColor = this.getCurColor(tilesSelected);
    return board.buildingLines[line].tiles[0].color == curColor;
  }

  isSameColorConstructed(line: number, tilesSelected: Tile[], board: Board) {
    let curColor = this.getCurColor(tilesSelected);
    return board.contructedLines[line].tiles.some(
      (t) => t.tile.color == curColor
    );
  }

  isEmpty(t: Tile) {
    return t.color == 'grey';
  }

  selectBuildSpace(line: number, selectCopy: Tile[], board: Board) {
    let hasWhite = false;
    let firstEmpty = board.buildingLines[line].tiles.findIndex((t) =>
      this.isEmpty(t)
    );
    let emptyQnt = board.buildingLines[line].tiles.filter((t) =>
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
          board.buildingLines[line].tiles[hasWhite ? i - 1 : i].color =
            currTile.color;
          board.buildingLines[line].tiles[hasWhite ? i - 1 : i].index =
            currTile.index;
        } else {
          hasWhite = true;
          let lastBroken = board.brokenLine.findIndex((s) => !!s.tile);
          board.brokenLine[lastBroken + 1].tile = currTile;
        }
      }
    }
    if (selectCopy.length > 0) {
      selectCopy.forEach((curTile) => {
        let lastBroken = board.brokenLine.findIndex((s) => s.tile == undefined);
        board.brokenLine[lastBroken].tile = curTile;
      });
    }
  }

  selectBroken(selectCopy: Tile[], board: Board) {
    let firstEmpty = board.brokenLine.findIndex((t) => t.tile == undefined);
    let emptyQnt = board.brokenLine.filter((t) => t.tile == undefined).length;
    for (let i = firstEmpty; i < firstEmpty + emptyQnt; i++) {
      if (selectCopy.length > 0) {
        let currTile = selectCopy.splice(0, 1)[0];
        board.brokenLine[i].tile = { ...currTile, selected: false };
      }
    }
  }

  findColorColumn(
    constructedSpaces: { color: string; column: number }[],
    color: string
  ): number {
    return constructedSpaces.find((s) => s.color == color)?.column || -1;
  }

  countTilePoint(
    line: number,
    column: number,
    color: string,
    board: Board
  ): number {
    return (
      1 +
      this.findAdjacentTiles(line, column, board) +
      this.checkColumnFull(column, board) +
      this.checkRowFull(line, board) +
      this.checkColorFull(color, board)
    );
  }

  checkColumnFull(column: number, board: Board): number {
    return board.contructedLines.filter((ts) =>
      ts.tiles.some((t) => t.column == column)
    ).length == 5
      ? 7
      : 0;
  }

  checkRowFull(line: number, board: Board): number {
    if (board.contructedLines[line].tiles.length == 5) {
      this.playerFinishedRow = true;
    }
    return board.contructedLines[line].tiles.length == 5 ? 2 : 0;
  }

  checkColorFull(color: string, board: Board) {
    return board.contructedLines.filter((line) =>
      line.tiles.some((t) => t.tile.color == color)
    ).length == 5
      ? 10
      : 0;
  }

  findAdjacentTiles(line: number, column: number, board: Board): number {
    let points = this.checkAdjacentTile(line, column, board) ? 1 : 0;
    for (let i = column + 1; i < 5; i++) {
      if (board.contructedLines[line].tiles.find((t) => t.column == i)) {
        points++;
      } else {
        break;
      }
    }
    for (let i = column - 1; i > -1; i--) {
      if (board.contructedLines[line].tiles.find((t) => t.column == i)) {
        points++;
      } else {
        break;
      }
    }
    for (let i = line + 1; i < 5; i++) {
      if (board.contructedLines[i].tiles.find((t) => t.column == column)) {
        points++;
      } else {
        break;
      }
    }
    for (let i = line - 1; i > -1; i--) {
      if (board.contructedLines[i].tiles.find((t) => t.column == column)) {
        points++;
      } else {
        break;
      }
    }
    console.log(board.playerId, line, column, points);
    return points;
  }

  checkAdjacentTile(line: number, column: number, board: Board): boolean {
    let hasCol = false;
    let hasLine = false;
    if (column + 1 < 5) {
      hasCol = board.contructedLines[line].tiles.some(
        (t) => t.column == column + 1
      );
    }
    if (!hasCol && column - 1 >= 0) {
      hasCol = board.contructedLines[line].tiles.some(
        (t) => t.column == column - 1
      );
    }
    if (line + 1 < 5) {
      hasLine = board.contructedLines[line + 1].tiles.some(
        (t) => t.column == column
      );
    }
    if (!hasLine && line - 1 >= 0) {
      hasLine = board.contructedLines[line - 1].tiles.some(
        (t) => t.column == column
      );
    }

    return hasCol && hasLine;
  }

  countBrokenPoints(board: Board): number {
    let points = 0;
    board.brokenLine.forEach((s) => {
      if (s.tile != undefined) {
        points += s.pointLoss;
      }
    });
    return points;
  }

  hasWhiteTile(board: Board): boolean {
    return board.brokenLine.some((s) => s.tile?.color == 'white');
  }
}
