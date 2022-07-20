import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { stocksChartComponent } from './stocks-chart.component'
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    stocksChartComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    FormsModule,
  ],
  exports: [
    stocksChartComponent
  ]
})
export class stocksChartModule { }
