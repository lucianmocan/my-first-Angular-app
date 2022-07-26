import { Injectable } from '@angular/core';
import { auth } from 'src/app/app.module';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private routes: Router) { }

  // checkIfLoggedOut () {
  //   let check = localStorage.getItem('logged-out');
  //   if (check == 'yes') {
  //     document
  //       .getElementById('log-out')
  //       .style.setProperty('display', 'block');
  //     setTimeout(() => {
  //       localStorage.removeItem('logged-out');
  //       document
  //         .getElementById('log-out')
  //         .style.setProperty('display', 'none');
  //     }, 2500);
  //   }
  //   else if (check == 'no') {
  //     this.routes.navigate(['/dashboard']);
  //   }
  // }

  
  async LogUserIn(emailElement, passwordElement, alertElement, inUsrElement, inPassElement) : Promise<void> {
    let userId = emailElement.nativeElement.value;
    let userPass = passwordElement.nativeElement.value;

    signInWithEmailAndPassword(auth, userId, userPass)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        let idToken = await user.getIdToken();
        localStorage.setItem('accessToken', idToken);
        if (user.emailVerified){
          localStorage.setItem('displayName', user.displayName);
          localStorage.setItem('session', user.uid);
          console.log(user.displayName);
          localStorage.setItem('logged-out', 'no');
          emailElement.nativeElement.classList.remove("is-invalid");
          passwordElement.nativeElement.classList.remove("is-invalid");
          emailElement.nativeElement.classList.add("is-valid");
          passwordElement.nativeElement.classList.add("is-valid");
          alertElement.nativeElement.classList.remove("alert-danger");
          alertElement.nativeElement.classList.add("alert-success");
          alertElement.nativeElement.style.setProperty('display', 'block');
          alertElement.nativeElement.textContent = "Log-in successful!";
          setTimeout(() => {
            localStorage.setItem('logged-out', 'no');
            this.routes.navigate(['/dashboard']);
          }, 400);
          }
        else {
          setTimeout(() => {
            this.routes.navigate(['/external/verification']);
          }, 400);
        }
      })
      .catch((error) => {
         emailElement.nativeElement.classList.add("is-invalid");
         passwordElement.nativeElement.classList.add("is-invalid");
         passwordElement.nativeElement.value = "";
         emailElement.nativeElement.value = "";
         if (!(userId == "" && userPass == "")){
                 inUsrElement.nativeElement.textContent = "Incorrect email";
                 inPassElement.nativeElement.textContent = "Incorrect password";
                 alertElement.nativeElement.style.setProperty('display', 'block');
         }
         else {
                 inUsrElement.nativeElement.textContent = "Email required";
                 inPassElement.nativeElement.textContent = "Password required";
         }
      })
  }

}
