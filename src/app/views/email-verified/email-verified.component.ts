import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { applyActionCode, getAuth } from 'firebase/auth';
import { auth } from 'src/app/app.module';

@Component({
  templateUrl: 'email-verified.html'
})
export class emailVerified implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit():  void {

  }



  ngAfterViewInit(){
    this.route.queryParams
    .subscribe(params => {

    const mode = params.mode;
    const actionCode = params.oobCode;
    const continueUrl = params.continueUrl;

    console.log(mode);
    console.log(actionCode)

    switch (mode) {
      // case 'resetPassword':
      //   handleResetPassword(auth, actionCode, continueUrl);
      //   break;
      // case 'recoveryEmail':
      //   handleRecoverEmail(auth, actionCode);
      //   break;
      case 'verifyEmail':
        this.handleVerifyEmail(auth, actionCode);
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

  goToDashboard(){}
}
