import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { FootballWidgetModule } from '../footballWidget/football-widget/football-widget.module';
import { stocksChartModule } from '../stocksChart/stocks-chart.module';
import { cryptoChartModule } from '../cryptoChart/crypto-chart.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { cryptoChartService } from '../cryptoChart/crypto-chart.service';
import { cryptoDirective } from '../cryptoChart/crypto.directive';

import { stocksDirective } from '../stocksChart/stocks.directive';
import { stocksChartService } from '../stocksChart/stocks-chart.service';

import { footballDirective } from '../footballWidget/football.directive';
import { FootballWidgetService } from '../footballWidget/football-widget.service';

import { DashboardService } from './dashboard.service'

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    cryptoChartModule,
    stocksChartModule,
    FootballWidgetModule,

  ],
  declarations: [ 
    DashboardComponent,
    cryptoDirective,
    stocksDirective,
    footballDirective
    ],
  providers: [
    cryptoChartService,
    stocksChartService,
    FootballWidgetService,
    DashboardService,
  ]
})
export class DashboardModule { }
