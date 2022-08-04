import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { AppHeaderModule } from '@coreui/angular';

@NgModule({
  imports: [
    FormsModule,
    LoginRoutingModule,
    AppHeaderModule
  ],
  declarations: [ LoginComponent ]
})
export class LoginModule { }
