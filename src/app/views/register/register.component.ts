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
  @ViewChild('invalidrPass') inrPassElement: ElementRef;
  @ViewChild('registeredS') registeredSElement: ElementRef;
  @ViewChild('registeredF') registeredFElement: ElementRef;
  @ViewChild('infoBox') infoBoxElement: ElementRef;

  constructor(usernameElement: ElementRef, 
              passwordElement: ElementRef, 
              rpasswordElement: ElementRef,
              private routes: Router
    ){
    this.usernameElement=usernameElement;
    this.passwordElement=passwordElement;
    this.rpasswordElement=rpasswordElement;
  }


  async createAccount() : Promise<void> {

    const myUsername :string = this.usernameElement.nativeElement.value;
    const myPassword : string = this.passwordElement.nativeElement.value;
    const myrPassword : string= this.rpasswordElement.nativeElement.value;

    if (myUsername == ""){
      this.rpasswordElement.nativeElement.value = "";
      this.passwordElement.nativeElement.value = "";
      this.usernameElement.nativeElement.classList.remove("is-valid");
      this.passwordElement.nativeElement.classList.remove("is-valid");
      this.usernameElement.nativeElement.classList.add("is-invalid");
      this.passwordElement.nativeElement.classList.add("is-invalid");
      this.rpasswordElement.nativeElement.classList.add("is-invalid");
    }
    else

    if (myUsername != "") {

      const userRef = collection(db, "Utilizatori");
      const userSearch = query(userRef, where("username", "==", myUsername));

      const querySnapshot = await getDocs(userSearch);
      
        if (querySnapshot.empty) {
          this.usernameElement.nativeElement.classList.remove("is-invalid");
          this.usernameElement.nativeElement.classList.add("is-valid");
          if (myPassword != ""){
              if (myPassword == myrPassword){
                this.passwordElement.nativeElement.classList.remove("is-invalid");
                this.rpasswordElement.nativeElement.classList.remove("is-invalid");
                this.passwordElement.nativeElement.classList.add("is-valid");
                this.rpasswordElement.nativeElement.classList.add("is-valid");
                await setDoc(doc((collection(db, "Utilizatori"))),{
                  username: myUsername,
                  password: myPassword
                }) ;
                this.registeredFElement.nativeElement
                .style.setProperty('display', 'none');
                this.infoBoxElement.nativeElement
                .style.setProperty('display', 'block');
                this.registeredSElement.nativeElement
                .style.setProperty('display', 'block');
                setTimeout(() => {
                  this.routes.navigate(['/login']);
                }, 1500);}

              else {
                this.rpasswordElement.nativeElement.classList.add("is-invalid");
                this.rpasswordElement.nativeElement.value = "";
                this.passwordElement.nativeElement.classList.remove("is-invalid");
                this.passwordElement.nativeElement.classList.add("is-valid");
              }
          }
          else {
            this.passwordElement.nativeElement.classList.remove("is-valid");
            this.rpasswordElement.nativeElement.classList.add("is-invalid");
            this.rpasswordElement.nativeElement.value = "";
            this.passwordElement.nativeElement.classList.add("is-invalid");
            this.passwordElement.nativeElement.value = "";
 
          }

        }
        else {
          this.usernameElement.nativeElement.classList.remove("is-valid");
          this.passwordElement.nativeElement.classList.remove("is-valid");
          this.inUsrElement.nativeElement.textContent = "Username taken! Try something else.";
          this.usernameElement.nativeElement.classList.add("is-invalid");
          this.rpasswordElement.nativeElement.value = "";
          this.rpasswordElement.nativeElement.classList.add("is-invalid");
          this.passwordElement.nativeElement.value = "";
          this.passwordElement.nativeElement.classList.add("is-invalid"); 
          this.infoBoxElement.nativeElement
          .style.setProperty('display', 'block');
          this.registeredFElement.nativeElement
          .style.setProperty('display', 'block');
        }
    }
  }
}
