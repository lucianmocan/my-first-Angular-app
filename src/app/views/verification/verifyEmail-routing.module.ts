import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { verifyEmail } from './verifyEmail.component';

const routes: Routes = [
  {
    path: '',
    component: verifyEmail,
    data: {
      title: 'Verify registration by email'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class verifyEmailRoutingModule {}
