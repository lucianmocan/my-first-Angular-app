import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { My2ChartComponent } from './my2-chart.component'
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    My2ChartComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    FormsModule
  ],
  exports: [
    My2ChartComponent
  ]
})
export class My2ChartModule { }
