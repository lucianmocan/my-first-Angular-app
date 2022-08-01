import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { emailVerified } from './email-verified.component';
import { emailVerifiedRoutingModule } from './email-verified.routing';

import { applyActionCode, getAuth } from 'firebase/auth';
import { querystring } from '@firebase/util';
import { auth } from 'src/app/app.module';

@NgModule({
  imports: [
    FormsModule,
    emailVerifiedRoutingModule
  ],
  declarations: [ emailVerified ]
})
export class emailVerifiedModule { 
}

