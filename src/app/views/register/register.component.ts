import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarToggleDirective } from '@coreui/angular/lib/shared/layout/layout.directive';
import { cibTypescript } from '@coreui/icons';
import {doc, setDoc, collection, query, where, getFirestore, getDoc, getDocs, QuerySnapshot} from 'firebase/firestore';
import { db, auth } from '../../app.module';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html',
  styleUrls: ['register.components.scss']
})
export class RegisterComponent {

  userid = '1';

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


  constructor(usernameElement: ElementRef, 
              passwordElement: ElementRef, 
              rpasswordElement: ElementRef,
              private routes: Router
    ){
    this.usernameElement=usernameElement;
    this.passwordElement=passwordElement;
    this.rpasswordElement=rpasswordElement;
    this.emailElement=this.emailElement;
  }

  async createAccount() : Promise<void> {

    const myUsername :string = this.usernameElement.nativeElement.value;
    const myPassword : string = this.passwordElement.nativeElement.value;
    const myrPassword : string= this.rpasswordElement.nativeElement.value;
    const myEmail : string = this.emailElement.nativeElement.value;

    if (myUsername == ""){
       this.rpasswordElement.nativeElement.value = "";
       this.passwordElement.nativeElement.value = "";
       this.usernameElement.nativeElement.classList.remove("is-valid");
       this.passwordElement.nativeElement.classList.remove("is-valid");
       this.usernameElement.nativeElement.classList.add("is-invalid");
       this.passwordElement.nativeElement.classList.add("is-invalid");
       this.rpasswordElement.nativeElement.classList.add("is-invalid");
       this.emailElement.nativeElement.classList.remove("is-valid");
       this.emailElement.nativeElement.classList.add("is-invalid");
    }
     else
    if (myUsername != "") {

       const userRef = collection(db, "Utilizatori");
       const userSearch = query(userRef, where("username", "==", myUsername));

       const querySnapshot = await getDocs(userSearch);
       console.log(querySnapshot.empty);
         if (querySnapshot.empty) {

            this.usernameElement.nativeElement.classList.remove("is-invalid");
            this.usernameElement.nativeElement.classList.add("is-valid");

            if (myPassword == myrPassword) {
            createUserWithEmailAndPassword(auth, myEmail, myPassword)
              .then(async (userCredential) => {
                  const user = userCredential.user;
                  await setDoc(doc((collection(db, "Utilizatori"))),{
                    username: myUsername,
                  }) ;
                  updateProfile(auth.currentUser, {
                    displayName: myUsername
                  });
                  

                  console.log(user);
                  this.registeredFElement.nativeElement
                    .style.setProperty('display', 'none');
                    this.infoBoxElement.nativeElement
                    .style.setProperty('display', 'block');
                    this.registeredSElement.nativeElement
                    .style.setProperty('display', 'block');

                    this.emailElement.nativeElement.classList.remove("is-invalid");
                    this.emailElement.nativeElement.classList.add("is-valid");

                    this.rpasswordElement.nativeElement.classList.remove("is-invalid");
                    this.passwordElement.nativeElement.classList.remove("is-invalid");
                    this.rpasswordElement.nativeElement.classList.add("is-valid");
                    this.passwordElement.nativeElement.classList.add("is-valid");

                  setTimeout(() => {
                    sendEmailVerification(user);
                    this.routes.navigate(['/external/verification']);
                  }, 1500);})
                  .catch((error) => {

                  var errorCode = error.code;
                  console.log(errorCode);
                  console.log(error.message);

                  // email address validation using errorCodes from Firebase/auth
                  if (errorCode == 'auth/email-already-in-use') {
                    this.emailElement.nativeElement.classList.remove("is-valid");
                    this.emailElement.nativeElement.classList.add("is-invalid");
                    this.invEmail.nativeElement.textContent = "Email address already in use.";
                    this.emailElement.nativeElement.value = "";
                  }
                  else if (errorCode == 'auth/invalid-email' || errorCode == 'auth/missing-email') {
                    this.emailElement.nativeElement.classList.add("is-invalid");
                    this.invEmail.nativeElement.textContent = "Invalid email address format.";
                    this.emailElement.nativeElement.value = "";
                  }

                  // password validation using errorCodes from Firebase/auth
                  if (errorCode == 'auth/weak-password') {
                    this.emailElement.nativeElement.classList.remove("is-invalid");
                    this.emailElement.nativeElement.classList.add("is-valid");
                    this.passwordElement.nativeElement.value = "";
                    this.passwordElement.nativeElement.classList.add("is-invalid"); 
                    this.inPassElement.nativeElement.textContent = "Password too weak! Should be at least 6 characters!";
                    this.rpasswordElement.nativeElement.value = "";
                    this.rpasswordElement.nativeElement.classList.add("is-invalid");
                  }
                  if (errorCode == 'auth/internal-error') {
                    this.emailElement.nativeElement.classList.remove("is-invalid");
                    this.emailElement.nativeElement.classList.add("is-valid");
                    this.passwordElement.nativeElement.value = "";
                    this.passwordElement.nativeElement.classList.add("is-invalid"); 
                    this.rpasswordElement.nativeElement.value = "";
                    this.rpasswordElement.nativeElement.classList.add("is-invalid");
                  }
          });
        }}

        else {
          this.usernameElement.nativeElement.classList.remove("is-valid");
          this.passwordElement.nativeElement.classList.remove("is-valid");
          this.emailElement.nativeElement.classList.remove("is-valid");
          this.inUsrElement.nativeElement.textContent = "Username not available! Try something else.";
          this.usernameElement.nativeElement.classList.add("is-invalid");
          this.rpasswordElement.nativeElement.value = "";
          this.rpasswordElement.nativeElement.classList.add("is-invalid");
          this.passwordElement.nativeElement.value = "";
          this.passwordElement.nativeElement.classList.add("is-invalid"); 
          this.emailElement.nativeElement.classList.add("is-invalid");
          this.emailElement.nativeElement.value = "";
          this.infoBoxElement.nativeElement
          .style.setProperty('display', 'block');
          this.registeredFElement.nativeElement
          .style.setProperty('display', 'block');
        }
    }
  }
}