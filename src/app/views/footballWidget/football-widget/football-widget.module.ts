import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballWidgetComponent } from './football-widget.component';


@NgModule({
  declarations: [
    FootballWidgetComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FootballWidgetComponent
  ]
})
export class FootballWidgetModule { }
