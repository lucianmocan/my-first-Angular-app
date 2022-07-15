import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { P500Component } from './500.component';

const routes: Routes = [
  {
    path: '',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class P500RoutingModule {}
