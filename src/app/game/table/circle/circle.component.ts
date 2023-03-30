import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Tile } from '../../tiles/tile';
import { TilesService } from '../../tiles/tiles.service';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
})
export class CircleComponent implements OnChanges {
  isEmpty: boolean = false;
  observer?: MutationObserver;
  @Input() tiles: Tile[] = [];
  @Output() clicked: EventEmitter<{ color: string; select: boolean }> =
    new EventEmitter();
  @ViewChild('circleContainer', { read: ElementRef })
  circleContainer?: ElementRef<HTMLElement>;
  @ViewChildren('tilesEle', { read: ElementRef }) tilesEle?: QueryList<
    ElementRef<HTMLElement>
  >;

  constructor(private tilesService: TilesService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.isEmpty = this.tiles.length == 0;
    setTimeout(() => {
      if (this.circleContainer && this.tilesEle) {
        this.tilesService.placeTiles(
          this.circleContainer.nativeElement,
          this.tiles,
          this.tilesEle.toArray().map((sp) => sp.nativeElement),
          false
        );
      }
    }, 200);
  }

  toggleSelection(tile: Tile) {
    this.clicked.emit({ color: tile.color, select: !tile.selected });
  }
}
