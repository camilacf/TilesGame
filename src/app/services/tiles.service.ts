import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { BuildingLine } from '../game/table/player-board/board';
export const colors: string[] = ['green', 'blue', 'yellow', 'red', 'teal'];

export interface Tile {
  color: string;
  index: number;
  selected: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TilesService {
  tiles: Tile[] = [];
  firstTile: Tile = { color: 'white', index: -1, selected: false };
  roundTilesSub: BehaviorSubject<Tile[][]> = new BehaviorSubject<Tile[][]>([]);
  tileTrash: Tile[] = [];
  spareTilesSub: BehaviorSubject<Tile[]> = new BehaviorSubject<Tile[]>([]);
  selectedTilesSub: BehaviorSubject<Tile[]> = new BehaviorSubject<Tile[]>([]);
  selectedCircleIndex: number = 0;

  constructor() {}

  isSameTile(t1: Tile, t2: Tile) {
    return t1.color == t2.color && t1.index == t2.index;
  }

  initTiles() {
    colors.forEach((c: string) => {
      for (let i = 0; i < 20; i++) {
        this.tiles.push({ color: c, index: i, selected: false });
      }
    });
  }

  resetTiles() {
    this.tiles = [];
    this.tileTrash = [];
    this.initTiles();
  }

  drawTiles(circles: number, n: number) {
    let sorted: Tile[][] = [];
    if (this.tiles.length < n * circles) {
      this.tiles = this.tiles.concat(this.tileTrash.slice());
      this.tileTrash = [];
    }
    for (let c = 0; c < circles; c++) {
      sorted.push([]);
      for (let i = 0; i < n; i++) {
        let index = Math.random() * this.tiles.length;
        sorted[c] = sorted[c].concat(this.tiles.splice(index, 1));
      }
    }
    this.roundTilesSub.next(sorted);
    this.spareTilesSub.next([this.firstTile]);
  }

  selectTiles(index: number, color: string, select: boolean) {
    let selectedAux: Tile[] = [];
    let allTiles =
      index >= 0
        ? this.roundTilesSub.getValue()[index]
        : this.spareTilesSub.getValue();
    this.selectedCircleIndex = index;
    if (select) {
      this.toggleTilesSelected(index);
    }
    if (allTiles.filter((t) => t.color == color).length > 0) {
      allTiles.forEach((t, i) => {
        if (t.color == color || t.color == 'white') {
          allTiles[i].selected = select;
          selectedAux.push(allTiles[i]);
        } else if (select) {
          allTiles[i].selected = !select;
        }
      });
    }
    this.selectedTilesSub.next(selectedAux);
  }

  tilesSelectedFromCircle() {
    return this.roundTilesSub.getValue().some((circle) => {
      return circle.some(
        (tile) =>
          !!this.selectedTilesSub
            .getValue()
            .find((t) => this.isSameTile(t, tile))
      );
    });
  }

  toggleTilesSelected(index: number) {
    let spare = this.spareTilesSub.getValue().slice();
    let round = this.roundTilesSub.getValue().slice();
    round.forEach((c, i) => {
      if (i != index) {
        round[i].forEach((t, j) => {
          round[i][j].selected = false;
        });
      }
    });
    spare.forEach((t, j) => {
      spare[j].selected = false;
    });
    this.roundTilesSub.next(round);
    this.spareTilesSub.next(spare);
  }

  noMoreTiles() {
    return (
      this.roundTilesSub
        .getValue()
        .reduce((acc, circle) => circle.length + acc, 0) == 0 &&
      this.spareTilesSub.getValue().length == 0
    );
  }

  emptySelected() {
    this.selectedTilesSub.next([]);
  }

  toSpare() {
    let spare = this.spareTilesSub.getValue().slice();
    let round = this.roundTilesSub.getValue().slice();
    this.roundTilesSub.getValue()[this.selectedCircleIndex].forEach((tile) => {
      if (
        !this.selectedTilesSub.getValue().some((t) => this.isSameTile(t, tile))
      ) {
        spare.push(tile);
      }
    });
    round[this.selectedCircleIndex] = [];
    this.roundTilesSub.next(round);
    this.spareTilesSub.next(spare);
  }

  formSpare() {
    let spare = this.spareTilesSub.getValue().slice();
    this.selectedTilesSub.getValue().forEach((tile) => {
      if (
        this.spareTilesSub
          .getValue()
          .findIndex((t) => this.isSameTile(t, tile)) >= 0
      ) {
        spare.splice(
          spare.findIndex((t) => this.isSameTile(t, tile)),
          1
        );
      }
    });
    this.spareTilesSub.next(spare);
  }

  throwOnTrash(buildingLine: BuildingLine) {
    for (let i = 0; i < buildingLine.tiles.length - 1; i++) {
      this.tileTrash.push(buildingLine.tiles[i]);
    }
  }
}
