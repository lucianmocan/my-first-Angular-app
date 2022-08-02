import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballWidgetComponent } from './football-widget.component';
import { PopupModule } from '../../popup-win/popup/popup.module';
import { CustomizeComponent } from '../customize/customize/customize.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    FootballWidgetComponent
  ],
  imports: [
    CommonModule, 
    PopupModule, 
    CustomizeComponent,
    DragDropModule
  ],
  exports: [
    FootballWidgetComponent
  ]
})
export class FootballWidgetModule { }
