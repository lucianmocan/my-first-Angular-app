import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetBrowserComponent } from './widget-browser.component';

import { cryptoChartModule } from '../cryptoChart/crypto-chart.module';
import { stocksChartModule } from '../stocksChart/stocks-chart.module';
import { FootballWidgetModule } from '../footballWidget/football-widget/football-widget.module';

@NgModule({
  declarations: [
    WidgetBrowserComponent
  ],
  imports: [
    CommonModule, 
    cryptoChartModule, 
    stocksChartModule, 
    FootballWidgetModule
  ],
  exports: [
    WidgetBrowserComponent
  ]
})
export class WidgetBrowserModule  {}
