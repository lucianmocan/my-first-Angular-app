import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cryptoChartComponent } from './crypto-chart.component'
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { NgbdDatepickerRangePopupModule} from '../datepicker/datepicker-range-popup.module'
import { PopupModule } from '../popup-win/popup/popup.module';

@NgModule({
  declarations: [
    cryptoChartComponent,
  ],
  imports: [
    CommonModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    FormsModule,
    NgbdDatepickerRangePopupModule,
    PopupModule
  ],
  exports: [
    cryptoChartComponent
  ]
})
export class cryptoChartModule  {}
