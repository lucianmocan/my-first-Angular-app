import { Component, ElementRef, ViewChild } from '@angular/core';

import { RegisterService } from './register.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html',
  styleUrls: ['register.components.scss']
})
export class RegisterComponent {

  @ViewChild('username') usernameElement: ElementRef;
  @ViewChild('password') passwordElement: ElementRef;
  @ViewChild('rpassword') rpasswordElement: ElementRef;
  @ViewChild('alert') alertElement: ElementRef;
  @ViewChild('invalidUsr') inUsrElement: ElementRef;
  @ViewChild('invalidPass') inPassElement: ElementRef;
  @ViewChild('invalidrPass') inrPassElement: ElementRef;
  @ViewChild('invEmail') invEmail: ElementRef;
  @ViewChild('registeredS') registeredSElement: ElementRef;
  @ViewChild('registeredF') registeredFElement: ElementRef;
  @ViewChild('email') emailElement: ElementRef;
  @ViewChild('infoBox') infoBoxElement: ElementRef;


  constructor(
              private registration: RegisterService
    ){
  }


  register () {
    this.registration.createAccount(
          this.usernameElement,
          this.passwordElement,
          this.rpasswordElement,
          this.inUsrElement,
          this.inPassElement,
          this.invEmail,
          this.registeredSElement,
          this.registeredFElement,
          this.emailElement,
          this.infoBoxElement
    );
  }

}