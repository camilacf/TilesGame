import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player, PlayersService } from 'src/app/services/players.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-init-modal',
  templateUrl: './init-modal.component.html',
  styleUrls: ['./init-modal.component.scss'],
})
export class InitModalComponent implements OnInit {
  @Output() start: EventEmitter<boolean> = new EventEmitter<boolean>();
  isCustomizing: boolean = false;

  form = new FormGroup({
    numPlayers: new FormControl<number>(2, [
      Validators.max(4),
      Validators.min(2),
    ]),
    playersList: new FormArray([
      new FormControl<string>('Player 1', Validators.required),
      new FormControl<string>('Player 2', Validators.required),
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<InitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private playersService: PlayersService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.form.controls.numPlayers.valueChanges.subscribe((val) => {
      if (val && val > this.form.controls.playersList.length)
        while (val - this.form.controls.playersList.length > 0) {
          this.form.controls.playersList.push(
            new FormControl(
              'Player ' + (this.form.controls.playersList.length + 1),
              Validators.required
            )
          );
        }
      else if (val && this.form.controls.playersList.length > val) {
        while (this.form.controls.playersList.length - val > 0) {
          this.form.controls.playersList.removeAt(
            this.form.controls.playersList.length - 1
          );
        }
      }
    });
  }

  savePlayers() {
    if (this.form.valid) {
      let players: Player[] = [];

      let firstInd = Math.round(
        Math.random() * (this.form.controls.playersList.length - 1)
      );
      let order = Array(this.form.controls.playersList.length)
        .fill(0)
        .map((o, i) => {
          if (i - firstInd >= 0) {
            return i - firstInd;
          } else {
            return this.form.controls.playersList.length - firstInd + i;
          }
        });
      this.form.controls.playersList.value.forEach((p, i) => {
        p = p || '';
        players.push({ name: p, id: i, order: order[i], points: 0 });
      });
      this.playersService.setPlayers(players);
      this.dialogRef.close();
    }
  }
}
