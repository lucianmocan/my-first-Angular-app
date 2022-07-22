import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent , ExternalLayoutComponent } from './containers';

import { FormsModule } from '@angular/forms';
const APP_CONTAINERS = [
  DefaultLayoutComponent,
  ExternalLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';


import { LoginGuard } from './auth/login.guard';
import { QRCodeModule } from 'angularx-qrcode'

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment'
import { getFirestore } from "firebase/firestore";
import { initializeApp } from 'firebase/app'; 
import { getAuth } from 'firebase/auth';

export const app = initializeApp(environment.firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserSessionService } from './user-session.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    QRCodeModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    HttpClientModule,
    NgbModule,
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    DefaultLayoutComponent,
    ExternalLayoutComponent
  ],
  providers: [
    LoginGuard,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
