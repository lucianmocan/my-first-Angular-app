import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cryptoChartComponent } from './crypto-chart.component'
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { NgbdDatepickerRangePopupModule} from '../datepicker/datepicker-range-popup.module'
import { PopupModule } from '../popup-win/popup/popup.module';
import { CustomizeComponent } from './customize/customize/customize.component';

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
    PopupModule,
    CustomizeComponent
  ],
  exports: [
    cryptoChartComponent
  ]
})
export class cryptoChartModule  {}
