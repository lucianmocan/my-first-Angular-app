import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarToggleDirective } from '@coreui/angular/lib/shared/layout/layout.directive';
import { cibTypescript } from '@coreui/icons';
import { Utilizator } from '../../utilizator.model';
import {doc, setDoc, collection, getFirestore} from 'firebase/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { db } from '../../app.module';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html',
  styleUrls: ['register.components.scss']
})
export class RegisterComponent {

  
  @ViewChild('username') usernameElement: ElementRef;
  @ViewChild('email') emailElement: ElementRef;
  @ViewChild('password') passwordElement: ElementRef;
  @ViewChild('rpassword') rpasswordElement: ElementRef;
  
  @ViewChild('alert') alertElement: ElementRef;
  @ViewChild('invalidUsr') inUsrElement: ElementRef;
  @ViewChild('invalidPass') inPassElement: ElementRef;

  constructor(usernameElement: ElementRef, 
              passwordElement: ElementRef, 
              emailElement: ElementRef,
              rpasswordElement: ElementRef,
              private routes: Router,
    ){
    this.usernameElement=usernameElement;
    this.passwordElement=passwordElement;
    this.rpasswordElement=rpasswordElement;
    this.emailElement=emailElement;
  }

  async createAccount() : Promise<void> {

    const myUsername :string = this.usernameElement.nativeElement.value;
    const myEmail : string = this.emailElement.nativeElement.value;
    const myPassword : string = this.passwordElement.nativeElement.value;
    const myrPassword : string= this.rpasswordElement.nativeElement.value;

    
    await setDoc(doc(db, "Utilizatori", '234'),{
      username: myUsername,
      email: myEmail,
      password: myPassword
    }) ;
  }
  
}
