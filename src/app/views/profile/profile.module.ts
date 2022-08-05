import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module'
import { CommonModule } from '@angular/common';
import { LoginService } from '../login/login.service';
import { ProfileService } from './profile.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from 'src/app/data.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ProfileRoutingModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    LoginService,
    ProfileService,
    DataService
  ],
  declarations: [ ProfileComponent ]
})
export class ProfileModule { }
