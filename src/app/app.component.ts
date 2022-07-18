import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { cilUser } from '@coreui/icons';

import { HttpService } from './http.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService],
})

export class AppComponent implements OnInit {
  
  posts: any;
  
  constructor(
    private router: Router,
    public iconSet: IconSetService,
    private httpService: HttpService
  ) {
    // iconSet singleton
    iconSet.icons = { cilUser };
  }

  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
