import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarToggleDirective } from '@coreui/angular/lib/shared/layout/layout.directive';
import { cibTypescript } from '@coreui/icons';
import {doc, setDoc, collection, query, where, getFirestore, getDoc, getDocs, QuerySnapshot} from 'firebase/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { db } from '../../app.module';

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
  @ViewChild('registered') registeredElement: ElementRef;

  constructor(usernameElement: ElementRef, 
              passwordElement: ElementRef, 
              rpasswordElement: ElementRef,
              private routes: Router,
              registeredElement: ElementRef
    ){
    this.usernameElement=usernameElement;
    this.passwordElement=passwordElement;
    this.rpasswordElement=rpasswordElement;
    this.registeredElement=registeredElement;
  }


  async createAccount() : Promise<void> {

    this.registeredElement.nativeElement
      .style.setProperty('display', 'none');
    const myUsername :string = this.usernameElement.nativeElement.value;
    const myPassword : string = this.passwordElement.nativeElement.value;
    const myrPassword : string= this.rpasswordElement.nativeElement.value;

    const userRef = collection(db, "Utilizatori");
    const userSearch = query(userRef, where("username", "==", myUsername));

    const querySnapshot = await getDocs(userSearch);
    if (querySnapshot.empty) {
      await setDoc(doc((collection(db, "Utilizatori"))),{
        username: myUsername,
        password: myPassword
      }) ;
      this.registeredElement.nativeElement
      .style.setProperty('display', 'block');
      setTimeout(() => {
        this.routes.navigate(['/login']);
      }, 2500)
    }
    else {
      this.registeredElement.nativeElement
      .classList.remove('alert-success');
      this.registeredElement.nativeElement
      .classList.add('alert-danger');
      this.registeredElement.nativeElement
      .textContent = 'There was an error while trying to register you.';
      this.registeredElement.nativeElement
      .style.setProperty('display', 'block');
    }

  }
  
}
