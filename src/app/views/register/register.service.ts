import { Injectable, OnInit, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

import {doc, setDoc, collection, query, where, getDoc, updateDoc, getDocs, limit} from 'firebase/firestore';
import { db, auth } from '../../app.module';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';

import { cryptoChartService } from '../cryptoChart/crypto-chart.service';
import { FootballWidgetService } from '../footballWidget/football-widget.service';
import { stocksChartService } from '../stocksChart/stocks-chart.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private routes: Router,
              private cryptoService : cryptoChartService,
              private stocksService : stocksChartService,
              private footballWidgetService : FootballWidgetService
    ) { }

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
  )  {

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

       const userRef = collection(db, 'Utilizatori');
       const userSearch = query(userRef, where("username", "==", myUsername));
      
       const querySnapshot = await getDocs(userSearch);
         if (querySnapshot.empty) {

            usernameElement.nativeElement.classList.remove("is-invalid");
            usernameElement.nativeElement.classList.add("is-valid");

            if (myPassword == myrPassword) {
            createUserWithEmailAndPassword(auth, myEmail, myPassword)
              .then(async (userCredential) => {
                  const user = userCredential.user;
                  let token = await auth.currentUser.getIdToken();
                  await setDoc(doc((collection(db, 'Utilizatori'))),{
                    username: myUsername,
                    accessToken: token
                  });
                  updateProfile(auth.currentUser, {
                    displayName: myUsername
                  });
                  
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

                  setTimeout(async () => {
                    await this.createSettings(myUsername);
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

  async createSettings(username){
    let userRef = collection(db, 'Utilizatori');
    const userFind = query(userRef, where("username", "==", username), limit(1));
    const querySnap = await getDocs(userFind);
    this.cryptoService.getCharts();
    this.stocksService.getCharts();
    this.footballWidgetService.getCharts();

    setTimeout(() => {

      querySnap.forEach(async (document) => {
        console.log(this.cryptoService.charts);
        setDoc(doc(db, 'Utilizatori', document.id, 'userSettings','largeDiagram'),{});
        for (let i = 0 ; i < this.cryptoService.charts.length; i++){
            updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings','largeDiagram'), {
            [`${i}`]: { name: this.cryptoService.charts[i]['data']['name'],
          borderColor: this.cryptoService.charts[i]['data']['borderColor']}
        });
        }

        setDoc(doc(db, 'Utilizatori', document.id, 'userSettings','stockDiagram'),{});
        for (let i = 0 ; i < this.stocksService.charts.length; i++){
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings','stockDiagram'), {
          [`${i}`]: { 
            name: this.stocksService.charts[i]['data']['name'],
            type: this.stocksService.charts[i]['data']['type'],
            pointRadius: this.stocksService.charts[i]['data']['pointRadius'],
            bgcolor: this.stocksService.charts[i]['data']['bgcolor']
          }
          });
        }

        setDoc(doc(db, 'Utilizatori', document.id, 'userSettings','footballInfo'),{});
        for (let i = 0 ; i < this.footballWidgetService.charts.length; i++){
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings','footballInfo'), {
          [`${i}`]: { 
            league: this.footballWidgetService.charts[i]['data']['league'],
            team: this.footballWidgetService.charts[i]['data']['team']
          }
          });
        }

      })
    }, 500);
  }
}