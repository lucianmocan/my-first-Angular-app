import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballWidgetComponent } from './football-widget.component';
import { PopupModule } from '../../popup-win/popup/popup.module';
import { CustomizeComponent } from '../customize/customize/customize.component';


@NgModule({
  declarations: [
    FootballWidgetComponent
  ],
  imports: [
    CommonModule, 
    PopupModule, 
    CustomizeComponent
  ],
  exports: [
    FootballWidgetComponent
  ]
})
export class FootballWidgetModule { }
