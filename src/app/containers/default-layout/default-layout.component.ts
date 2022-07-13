import {Component, Injectable} from '@angular/core';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  constructor(private routes: Router) {}

  onLogout(){
    localStorage.setItem('logged-out', 'yes');
    localStorage.removeItem('session');
    setTimeout(() => {this.routes.navigate(['/login']);},400);
  }

  
}

