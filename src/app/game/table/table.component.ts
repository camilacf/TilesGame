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
import { Player, PlayersService } from 'src/app/services/players.service';
import { colors, Tile } from 'src/app/services/tiles.service';
import * as _ from 'lodash';
import { group } from '@angular/animations';
import { TilesService } from 'src/app/services/tiles.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  constructor(
    private playerService: PlayersService,
    private tilesService: TilesService,
    private cdr: ChangeDetectorRef
  ) {}
}
