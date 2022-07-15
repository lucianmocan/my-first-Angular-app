import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    FormsModule,
    LoginRoutingModule
  ],
  declarations: [ LoginComponent ]
})
export class LoginModule { }
