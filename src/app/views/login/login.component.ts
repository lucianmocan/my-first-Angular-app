import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';
import {doc, setDoc, collection, query, where, getFirestore, getDoc, getDocs, QuerySnapshot} from 'firebase/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { db } from '../../app.module';

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
    else if (check == 'no') {
      this.routes.navigate(['/dashboard']);
    }
  }
  
  async checkUser (username, password: string) {
    const userRef = collection(db, "Utilizatori");
    const userSearch = query(userRef, where("username", "==", username));

    let usr : string;
    let pass : string;
    const querySnapshot = await getDocs(userSearch);

    if (querySnapshot.size != 0){
      usr = querySnapshot.docs[0].data().username;
      pass = querySnapshot.docs[0].data().password;

      if (usr == username && pass == password)
        {
          return Promise.resolve([true, true]);
        }
      else if (usr == username && pass != password) 
        return Promise.resolve([true, false]);
      else
        return Promise.resolve([false, false]);
    }
      else 
        return Promise.resolve([false, false]);
}


  async onLogin() : Promise<void> {
    let userId = this.usernameElement.nativeElement.value;
    let userPass = this.passwordElement.nativeElement.value;
    const boolArray = await Promise.all( await this.checkUser(userId, userPass));

    if (boolArray[0] && boolArray[1]){
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
      localStorage.setItem('logged-out', 'no');
    }
    else {
      
      this.usernameElement.nativeElement.classList.add("is-invalid");
      this.passwordElement.nativeElement.classList.add("is-invalid");
      this.passwordElement.nativeElement.value = "";
      this.usernameElement.nativeElement.value = "";
      if (!(userId == "" && userPass == "")){
              this.inUsrElement.nativeElement.textContent = "Incorrect username";
              this.inPassElement.nativeElement.textContent = "Incorrect password";
            this.alertElement.nativeElement.style.setProperty('display', 'block');
      }
      else {
          this.inUsrElement.nativeElement.textContent = "Username required";
          this.inPassElement.nativeElement.textContent = "Password required";
      }
    }
  }

  signUp() :void {
    this.routes.navigate(['/external/register']);
  }

}
