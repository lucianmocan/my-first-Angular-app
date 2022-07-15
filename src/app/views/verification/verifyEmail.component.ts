import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  templateUrl: 'verifyEmail.component.html'
})
export class verifyEmail implements OnInit {

  constructor(private routes: Router) { }

  ngOnInit():  void {
    setTimeout(() => {
      this.routes.navigate(['/external/login']);
    }, 5000)

  }
   
}
