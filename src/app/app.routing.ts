import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent, ExternalLayoutComponent } from './containers';

import { LoginGuard } from './auth/login.guard';

import { cilFullscreen } from '@coreui/icons';

export const routes: Routes = [
  {
    path:'',
    redirectTo: 'external/login',
    pathMatch: 'full'
  },
  {
    path:'',
    component: ExternalLayoutComponent,
    data: {
      title: 'Door'
    },
    children: [
      {
        path:'external/login',
        loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule),
        data: {
          title: 'Login Page'
        }
      },
      {
        path: 'external/register',
        loadChildren: () => import('./views/register/register.module').then(m => m.RegisterModule),
        data: {
          title: 'Register Page'
        }
      },
      {
        path: 'external/404',
        loadChildren: () => import('./views/error/404/404.module').then(m => m.P404Module),
        data: {
          title: 'Page 404'
        }
      },
      {
        path: 'external/500',
        loadChildren: () => import('./views/error/500/500.module').then(m => m.P500Module),
        data: {
          title: 'Page 500'
        }
      },
      {
        path:'external/verification',
        loadChildren: () => import('./views/verification/verifyEmail.module').then(m => m.verifyEmailModule),
        data: {
          title: 'Verify registration by email'
        }
      },
      {
        path:'external/user',
        loadChildren: () => import('./views/email-verified/email-verified.module').then(m => m.emailVerifiedModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivate: [LoginGuard],
    children: [
       {
        path: 'user/dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
        ,canActivate: [LoginGuard]
       },
       {
        path: 'user/profile',
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule)
       }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    loadChildren: () => import('./views/error/404/404.module').then(m => m.P404Module),
    data: {
      title: 'Page 404'
    }
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
