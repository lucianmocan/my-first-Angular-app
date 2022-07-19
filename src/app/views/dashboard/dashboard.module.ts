import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { My1ChartModule } from '../myCharts/1/my1-chart.module';
import { My2ChartModule } from '../myCharts/2/my2-chart.module'
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    My1ChartModule,
    My2ChartModule
  ],
  declarations: [ DashboardComponent]
})
export class DashboardModule { }
