import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdDatepickerRangePopup } from './datepicker-range-popup';

@NgModule({
  imports: [NgbModule, FormsModule],
  declarations: [NgbdDatepickerRangePopup],
  exports: [NgbdDatepickerRangePopup],
  bootstrap: [NgbdDatepickerRangePopup]
})
export class NgbdDatepickerRangePopupModule {}
