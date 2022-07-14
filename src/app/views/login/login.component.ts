import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.components.scss']
})



export class LoginComponent implements OnInit{
  
  @ViewChild('username') usernameElement: ElementRef;
  @ViewChild('password') passwordElement: ElementRef;
  @ViewChild('alert') alertElement: ElementRef;
  @ViewChild('invalidUsr') inUsrElement: ElementRef;
  @ViewChild('invalidPass') inPassElement: ElementRef;
  myUsername : string = "";
  myPassword : string = "";
  constructor(usernameElement: ElementRef, 
              passwordElement: ElementRef, 
              private routes: Router, 
              alertElement: ElementRef, 
    ){
    this.usernameElement=usernameElement;
    this.passwordElement=passwordElement;
    this.alertElement=alertElement;
  }

  userid = '1';

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
  }
  
  checkUser (username, password: string){
    if (username=='lucian' && password=="1234"){
      return [true, true]
    }
    else if (username == 'lucian' && password !="1234")
      return [true, false]
    else
      return [false, false]
  }

  onLogin() : void {
    let userId = this.usernameElement.nativeElement.value;
    let userPass = this.passwordElement.nativeElement.value;
    if (this.checkUser(userId, userPass)[0] && this.checkUser(userId, userPass)[1]){
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
      if (!(userId == "" && userPass == "")){
            if (this.checkUser(userId, userPass)[0]){
              this.usernameElement.nativeElement.classList.remove("is-invalid");
              this.usernameElement.nativeElement.classList.add("is-valid");
              this.inPassElement.nativeElement.textContent = "Incorrect password";
            }
            else  {
              this.usernameElement.nativeElement.classList.remove("is-valid");
              this.inUsrElement.nativeElement.textContent = "Incorrect username";
              this.inPassElement.nativeElement.textContent = "Incorrect password";
            }
            this.alertElement.nativeElement.style.setProperty('display', 'block');
      }
    }
  }

  signUp() :void {
    this.routes.navigate(['/register']);
  }

}
