import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { P404Component } from './404.component';
import { P404RoutingModule } from './404-routing.module';

@NgModule({
  imports: [
    FormsModule,
    P404RoutingModule
  ],
  declarations: [ P404Component ]
})
export class P404Module { }
