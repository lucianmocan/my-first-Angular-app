import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { emailVerified } from './email-verified.component';

const routes: Routes = [
  {
    path: '',
    component: emailVerified,
    data: {
      title: 'Email verified.'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class emailVerifiedRoutingModule {}
