import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent {
  @Output() start: EventEmitter<boolean> = new EventEmitter<boolean>();

  goToGame() {
    this.start.emit(true);
  }
}
