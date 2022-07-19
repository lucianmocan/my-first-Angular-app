import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './login.service' 

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.components.scss']
})


export class LoginComponent implements OnInit{
  
   @ViewChild('email') emailElement: ElementRef;
   @ViewChild('password') passwordElement: ElementRef;
   @ViewChild('alert') alertElement: ElementRef;
   @ViewChild('invalidUsr') inUsrElement: ElementRef;
   @ViewChild('invalidPass') inPassElement: ElementRef;
   myUsername : string = "";
   myPassword : string = "";

  constructor(emailElement: ElementRef, 
              passwordElement: ElementRef, 
              alertElement: ElementRef,
              inPassElement: ElementRef,
              inUsrElement: ElementRef,
              private routes: Router,  
              private login : LoginService
    ){
    this.emailElement=emailElement;
    this.passwordElement=passwordElement;
    this.alertElement=alertElement;
    this.inPassElement=inPassElement;
    this.inUsrElement=inUsrElement;
  }


  ngOnInit() : void {
    
    let check = localStorage.getItem('logged-out');
    if (check == 'yes') {
      document
        .getElementById('log-out')
        .style.setProperty('display', 'block');
      setTimeout(() => {
        localStorage.removeItem('logged-out');
        document
          .getElementById('log-out')
          .style.setProperty('display', 'none');
      }, 2500);
    }
    else if (check == 'no') {
      this.routes.navigate(['/dashboard']);
    }
  }

  onLogin(){
    this.login.LogUserIn (
          this.emailElement, 
          this.passwordElement,
          this.alertElement, 
          this.inUsrElement, 
          this.inPassElement
          );
  }

  signUp() : void {
    this.routes.navigate(['/external/register']);
  }

}
