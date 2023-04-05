import { ElementRef, Injectable, QueryList } from '@angular/core';
import * as _ from 'lodash';
import { Tile } from './tiles.service';

const tilesize = 25;

@Injectable({
  providedIn: 'root',
})
export class TileMovesService {
  calcSpaces(metric: number, tileSize: number) {
    return Math.floor(metric / tileSize);
  }

  placeTiles(
    container: ElementRef<HTMLElement> | undefined,
    tiles: Tile[],
    tilesRef: QueryList<ElementRef<HTMLElement>> | undefined,
    isSpare: boolean
  ) {
    if (tilesRef && container && tilesRef.length > 0) {
      let { top, left, xpos, ypos, rot } = this.getMeasures(
        container.nativeElement,
        isSpare
      );
      this.setSpareTiles(
        tilesRef.toArray().map((sp) => sp.nativeElement),
        tiles,
        top,
        left,
        xpos,
        ypos,
        rot,
        isSpare
      );
    }
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
      : Math.ceil(container.offsetTop + (r - width / 2)) + height * 0.08;
    let left = isSpare
      ? container.offsetLeft + 15
      : Math.ceil(container.offsetLeft + (r - width / 2)) + width * 0.08;
    let gRows = this.calcSpaces(width, tilesize);
    let gCols = this.calcSpaces(height, tilesize);
    let xpos = isSpare ? _.shuffle(_.range(gRows)) : _.shuffle(_.range(2));
    let ypos = isSpare ? _.shuffle(_.range(gCols)) : _.shuffle(_.range(2));
    let rot = Math.random() * 360;
    return { top: top, left: left, xpos: xpos, ypos: ypos, rot: rot };
  }
}
