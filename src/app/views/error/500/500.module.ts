import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { P500Component } from './500.component';
import { P500RoutingModule } from './500-routing.module';

@NgModule({
  imports: [
    FormsModule,
    P500RoutingModule
  ],
  declarations: [ P500Component ]
})
export class P500Module { }
