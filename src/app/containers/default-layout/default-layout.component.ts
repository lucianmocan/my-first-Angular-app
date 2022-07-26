import { Component } from '@angular/core';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
import { signOut } from "firebase/auth" 
import { auth } from 'src/app/app.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  public loggedOut = false;
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  constructor(private routes: Router) {}

  onLogout(){
    this.loggedOut = true;
    localStorage.setItem('logged-out', 'yes');
    localStorage.setItem('session','');
    localStorage.removeItem('accessToken');
    
    signOut(auth).then(() => {
      this.routes.navigate(['/external/login']);
    })
  }

  
}

