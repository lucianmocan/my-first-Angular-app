import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { stocksChartModule } from '../stocksChart/stocks-chart.module';
import { cryptoChartModule } from '../cryptoChart/crypto-chart.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    cryptoChartModule,
    stocksChartModule
  ],
  declarations: [ DashboardComponent]
})
export class DashboardModule { }
