import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Player, PlayersService } from 'src/players.service';
import { colors, Tile } from '../tiles/tile';
import * as _ from 'lodash';
import { group } from '@angular/animations';
import { TilesService } from '../tiles/tiles.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  players: Player[];
  turnPlayer?: Player;
  round: number = 0;
  roundTiles: Tile[][];
  tableTiles: Tile[] = [];
  selectedTiles: Tile[] = [];
  selectedCircleIndex: number = 0;
  countPoints: boolean = false;
  @ViewChild('spareContainer', { read: ElementRef })
  spareContainer?: ElementRef<HTMLElement>;
  @ViewChildren('spareTiles', { read: ElementRef })
  spareTiles?: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private playerService: PlayersService,
    private tilesService: TilesService,
    private cdr: ChangeDetectorRef
  ) {
    this.players = this.playerService.getPlayers();
    this.roundTiles =
      this.players.length == 2
        ? Array(5).fill([])
        : this.players.length == 3
        ? Array(7).fill([])
        : Array(9).fill([]);
  }

  ngOnInit() {
    this.tilesService.initGame();
    this.tableTiles = [this.tilesService.firstTile];
  }

  ngAfterViewInit(): void {
    this.initRound();
    this.cdr.detectChanges();
  }

  initRound() {
    this.roundTiles = this.roundTiles.map((c) =>
      this.tilesService.drawTiles(4)
    );

    if (this.spareTiles && this.spareContainer && this.spareTiles.length > 0) {
      this.tilesService.placeTiles(
        this.spareContainer.nativeElement,
        this.tableTiles,
        this.spareTiles.toArray().map((sp) => sp.nativeElement),
        true
      );
    }
    this.firstPlayerTurn();
  }

  onTileClicked(index: number, event: { color: string; select: boolean }) {
    this.selectedTiles = [];
    this.selectedCircleIndex = index;
    let allTiles = index >= 0 ? this.roundTiles[index] : this.tableTiles;
    if (event.select) {
      this.toggleTilesSelected(index);
    }
    if (allTiles.filter((t) => t.color == event.color).length > 0) {
      allTiles.forEach((t, i) => {
        if (t.color == event.color || t.color == 'white') {
          allTiles[i].selected = event.select;
          this.selectedTiles.push(allTiles[i]);
        } else if (event.select) {
          allTiles[i].selected = !event.select;
        }
      });
      this.cdr.detectChanges();
    }
  }

  toggleTilesSelected(index: number) {
    this.roundTiles.forEach((c, i) => {
      if (i != index) {
        this.roundTiles[i].forEach((t, j) => {
          this.roundTiles[i][j].selected = false;
        });
      }
    });
    this.tableTiles.forEach((t, j) => {
      this.tableTiles[j].selected = false;
    });
  }

  hasIntersectionTiles(list1: Tile[], list2: Tile[]) {
    return list2.some(
      (tile) => !!list1.find((t) => this.tilesService.isSameTile(t, tile))
    );
  }

  onTilesPlaced() {
    if (
      this.roundTiles.some((circle) => {
        return this.hasIntersectionTiles(this.selectedTiles, circle);
      })
    ) {
      this.moveToSpare();
    } else {
      this.moveFromSpare();
    }

    this.selectedTiles = [];
    if (this.noMoreTiles()) {
      this.countPoints = true;
    } else {
      this.changeTurn();
    }
  }

  noMoreTiles() {
    return (
      this.roundTiles.reduce((acc, circle) => circle.length + acc, 0) == 0 &&
      this.tableTiles.length == 0
    );
  }

  changeTurn() {
    let lastPlayed = this.turnPlayer?.order || 0;
    if (lastPlayed == this.players.length - 1) {
      this.firstPlayerTurn();
    } else {
      this.turnPlayer = this.players.find((p) => p.order == lastPlayed + 1);
    }
  }

  firstPlayerTurn() {
    this.turnPlayer = this.players.find((p) => p.order == 0);
  }

  moveFromSpare() {
    this.selectedTiles.forEach((tile) => {
      if (
        this.tableTiles.findIndex((t) =>
          this.tilesService.isSameTile(t, tile)
        ) >= 0
      ) {
        this.tableTiles.splice(
          this.tableTiles.findIndex((t) =>
            this.tilesService.isSameTile(t, tile)
          ),
          1
        );
      }
    });
  }

  moveToSpare() {
    this.roundTiles[this.selectedCircleIndex].forEach((tile) => {
      if (
        !this.selectedTiles.some((t) => this.tilesService.isSameTile(t, tile))
      ) {
        this.tableTiles.push(tile);
      }
    });
    this.roundTiles[this.selectedCircleIndex] = [];

    setTimeout(() => {
      if (
        this.spareTiles &&
        this.spareContainer &&
        this.spareTiles.length > 0
      ) {
        this.tilesService.placeTiles(
          this.spareContainer.nativeElement,
          this.tableTiles,
          this.spareTiles.toArray().map((sp) => sp.nativeElement),
          true
        );
      }
    }, 200);
  }
}
