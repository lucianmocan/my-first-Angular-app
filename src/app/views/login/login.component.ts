import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{

  constructor() {}
  userid = '1';
  ngOnInit() : void {
    localStorage.setItem('session', this.userid);
  }
 }
