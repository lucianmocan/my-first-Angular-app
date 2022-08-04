import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { applyActionCode, confirmPasswordReset, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from 'src/app/app.module';

@Component({
  templateUrl: 'email-verified.html',
  styleUrls: ['email-verified.scss']
})
export class emailVerified implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private renderer: Renderer2
              ) { }


  @ViewChild('formT') formT: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('sendButton') sendButton: ElementRef;
  @ViewChild('password') password: ElementRef;
  @ViewChild('rpassword') rpassword: ElementRef;
  @ViewChild('goToDash') goToDash: ElementRef;

  ngOnInit():  void {
    this.route.queryParams
    .subscribe(params => {
      switch(params.mode) {
        case 'resetPassword':
          this.temp = 'resetPassword';
          break;
        case 'verifyEmail':
          this.temp = 'emailVerified';
          break;
      }
    })
  }


  temp='forgotPassword';
  mode; actionCode;
  ngAfterViewInit(){
    this.route.queryParams
    .subscribe(params => {

    this.mode = params.mode;
    this.actionCode = params.oobCode;

    switch (this.mode) {
      // case 'recoveryEmail':
      //   handleRecoverEmail(auth, actionCode);
      //   break;
      case 'verifyEmail': {
        this.handleVerifyEmail(auth, this.actionCode);
      }
        break;
      default:
        console.log('error. invalid mode')
    }
    })


  }

  handleVerifyEmail(auth, actionCode){
    applyActionCode(auth, actionCode).then((resp) => {
        console.log(resp);
    }).catch((error) => {
      console.log(error);
    })
  }

  handleResetPassword(auth, actionCode){
    verifyPasswordResetCode(auth, actionCode)
    .then((email) => {
      const accountEmail = email;
      const newPassword = this.password.nativeElement.value;
      
      confirmPasswordReset(auth, actionCode, newPassword)
      .then((resp) => {
        this.renderer.addClass(this.password.nativeElement, 'disabled-input');
        this.renderer.addClass(this.rpassword.nativeElement, 'disabled-input');
        this.renderer.setAttribute(this.password.nativeElement, 'tabindex', "-1");
        this.renderer.setAttribute(this.rpassword.nativeElement, 'tabindex', "-1");
        this.renderer.setProperty(this.sendButton.nativeElement, 'textContent', 'Changed!')
        this.renderer.removeClass(this.sendButton.nativeElement, 'btn-outline-primary');
        this.renderer.addClass(this.sendButton.nativeElement, 'btn-success');
          signInWithEmailAndPassword(auth, accountEmail, newPassword)
          .then((userCredential) => {
            localStorage.setItem('displayName', userCredential.user.displayName);
            localStorage.setItem('session', userCredential.user.uid);
            localStorage.setItem('logged-out', 'no');
          })
          this.renderer.setStyle(this.goToDash.nativeElement, 'display', 'block');
      })
    })
  }

  sendPasswordResetLink(event){
      'use strict'
        if (!this.formT.nativeElement.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
      this.renderer.addClass(this.formT.nativeElement, 'was-validated');
      const email = this.email.nativeElement.value;
      sendPasswordResetEmail(auth, email)
      .then ( () => {
        this.renderer.addClass(this.email.nativeElement, 'disabled-input');
        this.renderer.setAttribute(this.email.nativeElement, 'tabindex', "-1");
        this.renderer.setProperty(this.sendButton.nativeElement, 'textContent', 'Sent!')
        this.renderer.removeClass(this.sendButton.nativeElement, 'btn-outline-primary');
        this.renderer.addClass(this.sendButton.nativeElement, 'btn-success');
        }
      )
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      })
  }

  updatePassword(event){
    'use strict'
      if (!this.formT.nativeElement.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      this.renderer.addClass(this.formT.nativeElement, 'was-validated');
      this.handleResetPassword(auth, this.actionCode);
  }


  goToDashboard(){
    this.router.navigate(['/user/dashboard']);
  }

  goToLogin(){
    this.router.navigate(['/external/login']);
  }
}

