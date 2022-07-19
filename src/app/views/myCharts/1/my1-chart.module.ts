import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { My1ChartComponent } from './my1-chart.component'
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    My1ChartComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    FormsModule
  ],
  exports: [
    My1ChartComponent
  ]
})
export class My1ChartModule { }
