import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IntroductionComponent } from './introduction/introduction.component';
import { GameComponent } from './game/game.component';
import { PlayerBoardComponent } from './game/table/player-board/player-board.component';
import { TableComponent } from './game/table/table.component';
import { TilesComponent } from './game/tiles/tiles.component';
import { CircleComponent } from './game/table/circle/circle.component';
import { EndModalComponent } from './modals/end-modal/end-modal.component';
import { InitModalComponent } from './modals/init-modal/init-modal.component';
import { WelcomeModalComponent } from './modals/welcome-modal/welcome-modal.component';
import { UploadImgComponent } from './upload-img/upload-img.component';

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
    WelcomeModalComponent,
    UploadImgComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
