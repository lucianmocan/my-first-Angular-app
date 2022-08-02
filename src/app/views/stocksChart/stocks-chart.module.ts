import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { stocksChartComponent } from './stocks-chart.component'
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { PopupModule } from '../popup-win/popup/popup.module';
import { CustomizeComponent } from '../stocksChart/customize/customize/customize.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
    PopupModule,
    DragDropModule,
    CustomizeComponent
  ],
  exports: [
    stocksChartComponent
  ]
})
export class stocksChartModule { }
