import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
import { signOut } from "firebase/auth" 
import { auth } from 'src/app/app.module';
import { DataService} from '../../data.service';
import { Subscription } from 'rxjs';
import { DashboardComponent } from 'src/app/views/dashboard/dashboard.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['default-layout.scss'],
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {

  @ViewChild('widgetBrowserContainer') widgetBrowserContainer: ElementRef;
  @ViewChild('widgetBrowser') widgetBrowser;
  @ViewChild('main') main: ElementRef;

  public sidebarMinimized = false;
  public navItems = navItems;
  public loggedOut = false;
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  constructor(private routes: Router,
              private data: DataService,
              private renderer: Renderer2,
              private dashboard: DashboardComponent
    ) {}


  message:string;
  subscriptionShow: Subscription;
  subSend: Subscription;
  customize = false;
  ngAfterViewInit(){
    this.sendWidgetRef(this.widgetBrowser, this.widgetBrowserContainer, this.main);
  }

  ngOnInit() {
    this.subscriptionShow = this.data.currentMessage
    .subscribe(message => {
        console.log(message);
        if (message == 'changed')
          this.showWidget();
      this.message = message
    })
    this.subSend = this.data.currentShow
    .subscribe(message => {

    })
  }

  sendWidgetRef(widgetBrowser, widgetBrowserContainer, main){
    this.data.changeData([widgetBrowser, widgetBrowserContainer, main]);
  }
  
  showWidget(){
    this.renderer.setStyle(this.widgetBrowserContainer.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.main.nativeElement, 'flex-direction', 'row');
  }

  ngOnDestroy() {
    this.subscriptionShow.unsubscribe();
    this.subSend.unsubscribe();
  }

  onLogout(){
    this.loggedOut = true;
    localStorage.setItem('logged-out', 'yes');
    localStorage.setItem('session','');
    localStorage.removeItem('accessToken');
    
    signOut(auth).then(() => {
      this.routes.navigate(['/external/login']);
    })
  }
  


}

