import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss'],
})
export class TilesComponent implements OnInit, OnChanges {
  @Input() color: string | undefined = 'grey';
  @Input() selected: boolean = false;
  @Input() isSelectable: boolean = false;
  @Input() isEmptyBoardSpace: boolean = false;
  label: string = '';

  ngOnInit() {}

  ngOnChanges() {
    this.color = this.color || 'grey';
    if (this.color == 'white') {
      this.label = '1';
    }
  }
}
