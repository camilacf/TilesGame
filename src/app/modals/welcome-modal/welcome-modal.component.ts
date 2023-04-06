import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InitModalComponent } from '../init-modal/init-modal.component';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss'],
})
export class WelcomeModalComponent {
  onInstructions: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<InitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  play() {
    this.dialogRef.close();
  }
}
