import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { emailVerified } from './email-verified.component';
import { emailVerifiedRoutingModule } from './email-verified.routing';

import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    FormsModule,
    emailVerifiedRoutingModule, 
    CommonModule
  ],
  declarations: [ emailVerified ]
})
export class emailVerifiedModule { 
}

