import { Injectable, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

import {doc, setDoc, collection, query, where, getFirestore, getDoc, getDocs, QuerySnapshot} from 'firebase/firestore';
import { db, auth } from '../../app.module';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private routes: Router) { }

  async createAccount(
    usernameElement,
    passwordElement,
    rpasswordElement,
    inUsrElement,
    inPassElement,
    invEmail,
    registeredSElement,
    registeredFElement,
    emailElement,
    infoBoxElement
  ) : Promise<void> {

    const myUsername :string = usernameElement.nativeElement.value;
    const myPassword : string = passwordElement.nativeElement.value;
    const myrPassword : string= rpasswordElement.nativeElement.value;
    const myEmail : string = emailElement.nativeElement.value;

    if (myUsername == ""){
       rpasswordElement.nativeElement.value = "";
       passwordElement.nativeElement.value = "";
       usernameElement.nativeElement.classList.remove("is-valid");
       passwordElement.nativeElement.classList.remove("is-valid");
       usernameElement.nativeElement.classList.add("is-invalid");
       passwordElement.nativeElement.classList.add("is-invalid");
       rpasswordElement.nativeElement.classList.add("is-invalid");
       emailElement.nativeElement.classList.remove("is-valid");
       emailElement.nativeElement.classList.add("is-invalid");
    }
     else
    if (myUsername != "") {

       const userRef = collection(db, "Utilizatori");
       const userSearch = query(userRef, where("username", "==", myUsername));

       const querySnapshot = await getDocs(userSearch);
       console.log(querySnapshot.empty);
         if (querySnapshot.empty) {

            usernameElement.nativeElement.classList.remove("is-invalid");
            usernameElement.nativeElement.classList.add("is-valid");

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
                  registeredFElement.nativeElement
                    .style.setProperty('display', 'none');
                    infoBoxElement.nativeElement
                    .style.setProperty('display', 'block');
                    registeredSElement.nativeElement
                    .style.setProperty('display', 'block');

                    emailElement.nativeElement.classList.remove("is-invalid");
                    emailElement.nativeElement.classList.add("is-valid");

                    rpasswordElement.nativeElement.classList.remove("is-invalid");
                    passwordElement.nativeElement.classList.remove("is-invalid");
                    rpasswordElement.nativeElement.classList.add("is-valid");
                    passwordElement.nativeElement.classList.add("is-valid");

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
                    emailElement.nativeElement.classList.remove("is-valid");
                    emailElement.nativeElement.classList.add("is-invalid");
                    invEmail.nativeElement.textContent = "Email address already in use.";
                    emailElement.nativeElement.value = "";
                  }
                  else if (errorCode == 'auth/invalid-email' || errorCode == 'auth/missing-email') {
                    emailElement.nativeElement.classList.add("is-invalid");
                    invEmail.nativeElement.textContent = "Invalid email address format.";
                    emailElement.nativeElement.value = "";
                  }

                  // password validation using errorCodes from Firebase/auth
                  if (errorCode == 'auth/weak-password') {
                    emailElement.nativeElement.classList.remove("is-invalid");
                    emailElement.nativeElement.classList.add("is-valid");
                    passwordElement.nativeElement.value = "";
                    passwordElement.nativeElement.classList.add("is-invalid"); 
                    inPassElement.nativeElement.textContent = "Password too weak! Should be at least 6 characters!";
                    rpasswordElement.nativeElement.value = "";
                    rpasswordElement.nativeElement.classList.add("is-invalid");
                  }
                  if (errorCode == 'auth/internal-error') {
                    emailElement.nativeElement.classList.remove("is-invalid");
                    emailElement.nativeElement.classList.add("is-valid");
                    passwordElement.nativeElement.value = "";
                    passwordElement.nativeElement.classList.add("is-invalid"); 
                    rpasswordElement.nativeElement.value = "";
                    rpasswordElement.nativeElement.classList.add("is-invalid");
                  }
          });
        }}

        else {
          usernameElement.nativeElement.classList.remove("is-valid");
          passwordElement.nativeElement.classList.remove("is-valid");
          emailElement.nativeElement.classList.remove("is-valid");
          inUsrElement.nativeElement.textContent = "Username not available! Try something else.";
          usernameElement.nativeElement.classList.add("is-invalid");
          rpasswordElement.nativeElement.value = "";
          rpasswordElement.nativeElement.classList.add("is-invalid");
          passwordElement.nativeElement.value = "";
          passwordElement.nativeElement.classList.add("is-invalid"); 
          emailElement.nativeElement.classList.add("is-invalid");
          emailElement.nativeElement.value = "";
          infoBoxElement.nativeElement
          .style.setProperty('display', 'block');
          registeredFElement.nativeElement
          .style.setProperty('display', 'block');
        }
    }
  }
}
