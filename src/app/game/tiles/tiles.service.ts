import { Injectable } from '@angular/core';
import { colors, Tile } from './tile';
import * as _ from 'lodash';
const tilesize = 25;

@Injectable({
  providedIn: 'root',
})
export class TilesService {
  tiles: Tile[] = [];
  tableTilesPos: { y: number; x: number }[] = [];
  firstTile: Tile = { color: 'white', index: -1, selected: false };
  constructor() {}

  isSameTile(t1: Tile, t2: Tile) {
    return t1.color == t2.color && t1.index == t2.index;
  }

  initGame() {
    colors.forEach((c: string) => {
      for (let i = 0; i < 20; i++) {
        this.tiles.push({ color: c, index: i, selected: false });
      }
    });
  }

  drawTiles(n: number): Tile[] {
    let sorted: Tile[] = [];
    if (this.tiles.length >= n) {
      for (let i = 0; i < n; i++) {
        let index = Math.random() * this.tiles.length;
        sorted = sorted.concat(this.tiles.splice(index, 1));
      }
    }
    return sorted;
  }

  calcSpaces(metric: number, tileSize: number) {
    return Math.floor(metric / tileSize);
  }

  placeTiles(
    container: HTMLElement,
    tiles: Tile[],
    tilesRef: HTMLElement[],
    isSpare: boolean
  ) {
    let { top, left, xpos, ypos, rot } = this.getMeasures(container, isSpare);
    this.setSpareTiles(tilesRef, tiles, top, left, xpos, ypos, rot, isSpare);
  }

  moveTile(tile: Tile) {}

  setSpareTiles(
    tilesRef: HTMLElement[],
    tiles: Tile[],
    top: number,
    left: number,
    xpos: number[],
    ypos: number[],
    rot: number,
    isSpare: boolean
  ) {
    tiles.forEach((t, i) => {
      tilesRef[i].style.position = 'absolute';
      tilesRef[i].style.left =
        (isSpare
          ? xpos[i] * tilesize + left
          : xpos[i >= 2 ? i % 2 : i] * tilesize * 1.5 + left) + 'px';
      tilesRef[i].style.top =
        (isSpare
          ? ypos[i] * tilesize + top
          : ypos[i >= 2 ? Math.abs((i % 2) - 1) : i] * tilesize * 1.5 + top) +
        'px';
      tilesRef[i].style.transform = 'rotate(' + rot + 'deg)';

      this.tableTilesPos.push({
        x: xpos[i],
        y: ypos[i],
      });
    });
  }

  getMeasures(
    container: HTMLElement,
    isSpare: boolean
  ): {
    top: number;
    left: number;
    xpos: number[];
    ypos: number[];
    rot: number;
  } {
    let r = container.offsetWidth / 2;
    let width = isSpare ? container.offsetWidth : r * Math.sqrt(2);
    let height = container.offsetHeight;
    let top = isSpare
      ? container.offsetTop + 15
      : Math.ceil(container.offsetTop + (r - width / 2)) + 2;
    let left = isSpare
      ? container.offsetLeft + 15
      : Math.ceil(container.offsetLeft + (r - width / 2)) + 2;
    let gRows = this.calcSpaces(width, tilesize);
    let gCols = this.calcSpaces(height, tilesize);
    let xpos = isSpare ? _.shuffle(_.range(gRows)) : _.shuffle(_.range(2));
    let ypos = isSpare ? _.shuffle(_.range(gCols)) : _.shuffle(_.range(2));
    let rot = Math.random() * 360;
    return { top: top, left: left, xpos: xpos, ypos: ypos, rot: rot };
  }
}
