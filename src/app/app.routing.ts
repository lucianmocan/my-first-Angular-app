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
      // {
      //   path: 'base',
      //   loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      // },
      // {
      //   path: 'buttons',
      //   loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      // },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
        ,canActivate: [LoginGuard]
      },
      // {
      //   path: 'icons',
      //   loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      // },
      // {
      //   path: 'notifications',
      //   loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      // },
      // {
      //   path: 'theme',
      //   loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      // }
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
