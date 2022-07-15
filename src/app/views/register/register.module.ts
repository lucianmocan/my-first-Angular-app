import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';

@NgModule({
  imports: [
    FormsModule,
    RegisterRoutingModule
  ],
  declarations: [ RegisterComponent ]
})
export class RegisterModule { }
