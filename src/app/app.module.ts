import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InitModalComponent } from './init-modal/init-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IntroductionComponent } from './introduction/introduction.component';
import { GameComponent } from './game/game.component';
import { PlayerBoardComponent } from './game/table/player-board/player-board.component';
import { TableComponent } from './game/table/table.component';
import { TilesComponent } from './game/tiles/tiles.component';
import { CircleComponent } from './game/table/circle/circle.component';
import { EndModalComponent } from './end-modal/end-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    InitModalComponent,
    IntroductionComponent,
    GameComponent,
    PlayerBoardComponent,
    TableComponent,
    TilesComponent,
    CircleComponent,
    EndModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
