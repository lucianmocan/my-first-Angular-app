import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { verifyEmail } from './verifyEmail.component';
import { verifyEmailRoutingModule } from './verifyEmail-routing.module';

@NgModule({
  imports: [
    FormsModule,
    verifyEmailRoutingModule
  ],
  declarations: [ verifyEmail ]
})
export class verifyEmailModule { }
