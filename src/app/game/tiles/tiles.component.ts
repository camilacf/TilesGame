import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { ColorsHelper, TilesService } from 'src/app/services/tiles.service';

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
  images: ColorsHelper = {
    green: '',
    blue: '',
    yellow: '',
    red: '',
    teal: '',
  };

  constructor(
    private tileService: TilesService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  ngOnInit() {
    //this.tileService.images.subscribe((imgs) => {
    let imgs = this.tileService.images;
    const head = this.document.getElementsByTagName('head')[0];
    const style = this.document.createElement('style');
    style.id = 'customImg';
    style.textContent += `.tile.green{ ${this.buildStyle(imgs.green)}}`;
    style.textContent += `.tile.blue{ ${this.buildStyle(imgs.blue)}}`;
    style.textContent += `.tile.yellow{ ${this.buildStyle(imgs.yellow)}}`;
    style.textContent += `.tile.red{ ${this.buildStyle(imgs.red)}}`;
    style.textContent += `.tile.teal{ ${this.buildStyle(imgs.teal)}}`;
    console.log(style);
    head.appendChild(style);
    //});
  }

  ngOnChanges() {
    this.color = this.color || 'grey';
    if (this.color == 'white') {
      this.label = '1';
    }
  }

  buildStyle(url: string) {
    if (url != '') {
      return `background-image: url(${url});
      background-size: cover;`;
    }
    return '';
  }
}
