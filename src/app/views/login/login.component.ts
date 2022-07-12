import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.components.scss']
})



export class LoginComponent implements OnInit{
  

  userid = '1';
  ngOnInit() : void {
  }
  
  checkUser (username, password: string){
    if (username=='lucian' && password=="1234"){
      return true
    }
    else
      return false
  }

  @ViewChild('username') usernameElement: ElementRef;
  @ViewChild('password') passwordElement: ElementRef;
  @ViewChild('alert') alertElement: ElementRef;
  @ViewChild('invalidUsr') inUsrElement: ElementRef;
  @ViewChild('invalidPass') inPassElement: ElementRef;
  @ViewChild('alertOut') alOutElement: ElementRef;
  myUsername : string = "";
  myPassword : string = "";
  constructor(usernameElement: ElementRef, 
              passwordElement: ElementRef, 
              private routes: Router, 
              alertElement: ElementRef, 
              alOutElement: ElementRef
    ){
    this.usernameElement=usernameElement;
    this.passwordElement=passwordElement;
    this.alertElement=alertElement;
    this.alOutElement=alOutElement;
  }

  onLogin() : void {
    let userId = this.usernameElement.nativeElement.value;
    let userPass = this.passwordElement.nativeElement.value;
    if (this.checkUser(userId, userPass)){
      this.usernameElement.nativeElement.classList.remove("is-invalid");
      this.passwordElement.nativeElement.classList.remove("is-invalid");
      this.usernameElement.nativeElement.classList.add("is-valid");
      this.passwordElement.nativeElement.classList.add("is-valid");
      this.alertElement.nativeElement.classList.remove("alert-danger");
      this.alertElement.nativeElement.classList.add("alert-success");
      this.alertElement.nativeElement.style.setProperty('display', 'block');
      this.alertElement.nativeElement.textContent = "Log-in successful!";
      setTimeout(() => {this.routes.navigate(['/dashboard']);},400);
      localStorage.setItem('session', this.userid);
    }
    else {
      this.usernameElement.nativeElement.classList.add("is-invalid");
      this.passwordElement.nativeElement.classList.add("is-invalid");
      if (!(this.usernameElement.nativeElement.value == "" &&
          this.passwordElement.nativeElement.value == "")) {
            this.inUsrElement.nativeElement.textContent = "Incorrect username or password";
            this.inPassElement.nativeElement.textContent = "Incorrect username or password";
            this.alertElement.nativeElement.style.setProperty('display', 'block');
          }
    }
  }

}

