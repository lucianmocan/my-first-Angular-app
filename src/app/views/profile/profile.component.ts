
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, sendEmailVerification, sendPasswordResetEmail, signOut, updateEmail, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, limit, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import SecureLS from 'secure-ls';
import { db } from 'src/app/app.module';
import { DataService } from 'src/app/data.service';
import { LoginService } from '../login/login.service';
import { ProfileService } from './profile.service';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {

  photoUrl; 

  constructor(
      private loginService : LoginService, 
      private renderer: Renderer2, 
      private routes: Router,
      private profileService: ProfileService,
      private data: DataService
  ) {}

  @ViewChild('email') emailRef: ElementRef;
  @ViewChild('password') passRef : ElementRef;
  @ViewChild('username') userRef : ElementRef;

  @ViewChild('userForm') userFormRef: ElementRef;
  @ViewChild('newUsername') newUserRef: ElementRef;
  @ViewChild('changeBtnU') changeBtnURef: ElementRef;
  @ViewChild('alertUser') alertUser: ElementRef;
  
  @ViewChild('sendBtn') sendBtnRef: ElementRef;
  @ViewChild('passDialog') passDialogRef: ElementRef;
  @ViewChild('alertPass') alertPass: ElementRef;
  @ViewChild('passMess') passMess: ElementRef;

  @ViewChild('emailForm') emailFormRef: ElementRef;
  @ViewChild('changeBtnE') changeBtnERef: ElementRef;
  @ViewChild('newEmail') newEmailRef: ElementRef;
  @ViewChild('alertEmail') alertEmail: ElementRef;

  @ViewChild('alertRecentLogin') alertLogin: ElementRef;

  email: string;
  password: string;

  htmlUser = "err";
  username: string;

  newDisplayName: string;
  newEmail: string;
  message;
  fileName: string = '';
  ngOnInit() {

  }

  ngOnDestroy(): void {
  }

  passMock: string = "";
  async ngAfterViewInit() {
    this.setInputValues();
    this.getProfilePhoto();
  }

  auth = getAuth();
  user = this.auth.currentUser;

  changeProfilePicture(){
    this.getProfilePhoto();
  }

  changeUsername(){
    this.newDisplayName = this.newUserRef.nativeElement;
    this.renderer.setProperty(this.changeBtnURef.nativeElement, 'textContent', 'Change');
    this.renderer.removeClass(this.changeBtnURef.nativeElement, 'btn-outline-success');
    this.renderer.addClass(this.changeBtnURef.nativeElement, 'btn-outline-primary');
    this.renderer.setStyle(this.userFormRef.nativeElement, 'display', 'block');
    this.renderer.removeClass(this.newDisplayName, 'is-valid');
    this.renderer.removeClass(this.newDisplayName, 'is-invalid');
    this.renderer.setProperty(this.newDisplayName, 'value', "");
  }
  async changeUsernameFirestore(){
    this.renderer.removeClass(this.newDisplayName, 'is-valid');
    this.renderer.removeClass(this.newDisplayName, 'is-invalid');
    if (this.newDisplayName['value'] != "") {
      console.log( this.userRef.nativeElement.value);
      const userRef = collection(db, 'Utilizatori');
      const userSearch = query(userRef, where("username", "==", this.newDisplayName['value']), limit(1));
     
      const querySnapshot = await getDocs(userSearch);
        if (querySnapshot.empty) {

          localStorage.setItem('displayName', this.newDisplayName['value']);
          this.renderer.removeClass(this.newDisplayName, 'is-invalid');
          this.renderer.addClass(this.newDisplayName, 'is-valid');
          const userSearch = query(userRef, where("username", "==", this.userRef.nativeElement.value), limit(1));
          const querySnap = await getDocs(userSearch)
          querySnap.forEach(async (document) => {
            let docRef = doc(db, 'Utilizatori', document.id);
            updateDoc(doc(db, 'Utilizatori', document.id), {
              username: this.newDisplayName['value']
            });
          })
          updateProfile(this.auth.currentUser, {
            displayName: this.newUserRef.nativeElement.value
          })
          this.htmlUser = this.newDisplayName['value'];
          this.renderer.setProperty(this.changeBtnURef.nativeElement, 'textContent', 'Changed!');
          this.renderer.removeClass(this.changeBtnURef.nativeElement, 'btn-outline-primary');
          this.renderer.addClass(this.changeBtnURef.nativeElement, 'btn-outline-success');
          setTimeout(() => {
            this.renderer.setStyle(this.userFormRef.nativeElement, 'display', 'none');
            this.renderer.setProperty(this.userRef.nativeElement, 'value', this.newUserRef.nativeElement.value);
          }, 300);
        }
        else {
          this.renderer.removeClass(this.newDisplayName, 'is-valid');
          this.renderer.addClass(this.newDisplayName, 'is-invalid');
        }
    }
    else {
      this.renderer.addClass(this.newDisplayName, 'is-invalid');
    }
}

  discardChanges(place: string){
    switch (place){
      case 'username':
        this.renderer.setStyle(this.userFormRef.nativeElement, 'display', 'none');
        break;
      case 'email':
        this.renderer.setStyle(this.emailFormRef.nativeElement, 'display', 'none');
        break;
      case 'password': {
        this.renderer.setStyle(this.passDialogRef.nativeElement, 'display', 'none');
        this.renderer.setStyle(this.passMess.nativeElement, 'display', 'none');
        }
        break;
    }
  }

  closeAlert(place: string){
    switch (place) {
      case 'username':
        this.renderer.setStyle(this.alertUser.nativeElement, 'display', 'none');
        break;
      case 'password':
        this.renderer.setStyle(this.alertPass.nativeElement, 'display', 'none');
        break;
      case 'email':
        this.renderer.setStyle(this.alertEmail.nativeElement, 'display', 'none');
        break;
    }
  }

  changeEmail(){
    this.renderer.setProperty(this.changeBtnERef.nativeElement, 'textContent', 'Change');
    this.renderer.removeClass(this.changeBtnERef.nativeElement, 'btn-outline-success');
    this.renderer.addClass(this.changeBtnERef.nativeElement, 'btn-outline-primary');
    this.renderer.setStyle(this.emailFormRef.nativeElement, 'display', 'block');
  }

  changeEmailFirestore(){
    updateEmail(this.auth.currentUser, this.newEmailRef.nativeElement.value).then(() => {
      this.renderer.setStyle(this.alertEmail.nativeElement, 'display', 'block');
      this.renderer.setProperty(this.changeBtnERef.nativeElement, 'textContent', 'Changed!');
      this.renderer.addClass(this.changeBtnERef.nativeElement, 'btn-outline-success');
      this.renderer.removeClass(this.changeBtnERef.nativeElement, 'btn-outline-primary');
      sendEmailVerification(this.auth.currentUser);
      this.email = this.newEmailRef.nativeElement.value;
      this.renderer.setProperty(this.emailRef.nativeElement,'value', this.email);
      this.loginService.email.set('email', {data:this.newEmailRef.nativeElement.value});
    })
    .catch((error) => {
      console.log(error.code);
      if (error.code == 'auth/requires-recent-login'){
        this.renderer.setStyle(this.alertLogin.nativeElement, 'display', 'block');
        setTimeout(() => {
          localStorage.setItem('logged-out', 'yes');
          localStorage.setItem('session','');
          localStorage.removeItem('accessToken');
          signOut(this.auth).then(() => {
              this.loginService.email.removeAll();
              this.loginService.password.removeAll();
              this.routes.navigate(['/external/login']);
          })
        }, 4000);
      }
    })
  }

  resetPassword(){
    this.renderer.setStyle(this.passDialogRef.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.sendBtnRef.nativeElement, 'display', 'block');
    this.renderer.setProperty(this.sendBtnRef.nativeElement, 'textContent', 'Send password reset link')
    this.renderer.removeClass(this.sendBtnRef.nativeElement, 'btn-success');
    this.renderer.addClass(this.sendBtnRef.nativeElement, 'btn-outline-primary');
    this.renderer.setStyle(this.passMess.nativeElement, 'display', 'block');
  }


  sendPasswordResetLink(){
    console.log(this.email);
    console.log(this.auth);
    sendPasswordResetEmail(this.auth, this.email)
    .then ( () => {
      this.renderer.setProperty(this.sendBtnRef.nativeElement, 'textContent', 'Sent!')
      this.renderer.removeClass(this.sendBtnRef.nativeElement, 'btn-outline-primary');
      this.renderer.addClass(this.sendBtnRef.nativeElement, 'btn-success');
      this.renderer.setProperty(this.sendBtnRef.nativeElement, "disabled", "");
      this.renderer.setStyle(this.alertPass.nativeElement, 'display', 'block');
      setTimeout(() => {
        this.renderer.setStyle(this.passMess.nativeElement, 'display', 'none');
        this.renderer.setStyle(this.passDialogRef.nativeElement, 'display', 'none');
      }, 1500)
      }
    )
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    })
}

  setInputValues(){
    this.username = localStorage.getItem('displayName');
    console.log(this.username);
    this.renderer.setProperty(this.userRef.nativeElement, 'value', this.username);

    this.email = this.loginService.email.get('email').data;
    this.renderer.setProperty(this.emailRef.nativeElement,'value', this.email);

    this.password = this.loginService.password.get('pass').data;
    for (let i = 0; i < this.password.length; i++){
      this.passMock += '●';
    }
    this.renderer.setProperty(this.passRef.nativeElement, 'value', this.passMock);
  }

  onFileSelected(event){
    const file: File = event.target.files[0];
    let name = localStorage.getItem('displayName');
    this.profileService.uploadProfileImage(name, file);
  }

  async getProfilePhoto(){
    let name = localStorage.getItem('displayName');
    await this.profileService.downloadProfileImage(name)
    .then((response) => 
        { 
        
        setTimeout(() => {
          this.photoUrl = this.profileService.profileImage;
        }, 1500)
      }
    )
  }
}
