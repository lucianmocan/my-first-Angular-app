import { Component, OnInit, ViewChild, Renderer2, OnDestroy, OnChanges, HostListener, ComponentRef, SimpleChanges, ElementRef, KeyValueDiffers, DoCheck } from '@angular/core';

import { DashChart } from './dashChart';

import { cryptoDirective } from '../cryptoChart/crypto.directive';
import { cryptoChartService } from '../cryptoChart/crypto-chart.service';

import { stocksDirective } from '../stocksChart/stocks.directive'; 
import { stocksChartService } from '../stocksChart/stocks-chart.service';

import { footballDirective } from '../footballWidget/football.directive';
import { FootballWidgetService } from '../footballWidget/football-widget.service';

import { DashComponent } from './dashComponent';
import { DashboardService } from './dashboard.service';

import { fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { preventOverflow } from '@popperjs/core';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  networkStatus: any;
  networkStatus$: Subscription = Subscription.EMPTY;

  @HostListener('unloaded')
  clearViewContainer(){
    this.cryptoCharts.viewContainerRef.clear();
    this.stocksCharts.viewContainerRef.clear();
    this.footballInfo.viewContainerRef.clear();
  }

  @ViewChild(cryptoDirective, { static: false}) cryptoCharts: cryptoDirective;
  @ViewChild(stocksDirective, { static: false }) stocksCharts: stocksDirective;
  @ViewChild(footballDirective, { static: false }) footballInfo: footballDirective;


  @ViewChild('spinnerContainer') spinnerContainer: ElementRef;
  @ViewChild('editBtn') editBtn: ElementRef;
  @ViewChild('finishBtn') finishBtn: ElementRef;
  @ViewChild('subBtnContainer1') subBtnContainer1: ElementRef;
  @ViewChild('messEditMode') messEditMode: ElementRef;
  @ViewChild('connectionStatus') connectionStatus: ElementRef;

  constructor(
    private cryptoChartService: cryptoChartService,
    private stocksChartService: stocksChartService,
    private footballWidgetService: FootballWidgetService,
    private dashboardService: DashboardService,
    private renderer: Renderer2,
  ) {
  }

  username = localStorage.getItem('displayName');
  accessToken = localStorage.getItem('accessToken');
  currentComponent : ComponentRef<DashComponent>;

  cryptoS: DashChart[] = [];
  stockS: DashChart[] = [];
  footballS: DashChart[] = [];

  cryptoComponents : Array<ComponentRef<DashComponent>> =[];

  async ngOnInit() {
    this.checkNetworkStatus();
    await this.dashboardService.getUserSettings(this.accessToken, this.username);

    setTimeout(() => {
      this.cryptoS = this.cryptoChartService.charts;
      // this.stockS = this.stocksChartService.charts;
      // this.footballS = this.footballWidgetService.charts;
      this.loadComponentsCrypto();
      // this.loadComponentStocks();
      // this.loadComponentFootball()
    }, 400);
  }

  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
  }


  prevNetworkStatus = true;
  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge (
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        if (this.prevNetworkStatus == false && status == true){
          this.renderer.removeClass(this.connectionStatus.nativeElement, 'alert-danger');
          this.renderer.addClass(this.connectionStatus.nativeElement, 'alert-success');
          this.renderer.setProperty(this.connectionStatus.nativeElement, 'textContent', 'Connection reestablished. Syncing changes. Reloading dashboard.');
          setTimeout(async () => {
            this.renderer.setStyle(this.connectionStatus.nativeElement, 'display', 'none');
            await this.dashboardService.getUserSettings(this.accessToken, this.username);
            setTimeout(async () => {
              this.cryptoS = this.cryptoChartService.charts;
              this.ENDeditDashInterface();
              this.loadComponentsCrypto();
            },400);
          }, 2500);
          
        } 
        if (status == false){
          this.renderer.setStyle(this.connectionStatus.nativeElement, 'display', 'block');
        }
        this.prevNetworkStatus = status;
        this.networkStatus = status;
      });
  }


  loadComponentsCrypto(){

    this.spinnerContainer.nativeElement.style.setProperty('display','none');

    const viewContainerRef = this.cryptoCharts.viewContainerRef;
    viewContainerRef.clear();
    //* loading the components from the cloud & creating dynamically
    for (const element in this.cryptoS){
      const componentRef = viewContainerRef
        .createComponent<DashComponent>(this.cryptoS[element].component);
      componentRef
        .instance.chartData = this.cryptoS[element].data;
      componentRef
        .instance.id = this.cryptoS[element].id;

      //* using this to access components when editing but not good idea
      //* should check again from the cloud, in case changes were made
      
      this.cryptoComponents.push(componentRef); 

      componentRef.instance['deleted']
        .subscribe(async val => {
          if (val) {
            componentRef.destroy();
            await this.dashboardService
                      .clearFromFirestoreCrypto (
                        componentRef.instance['chartData']['name'], 
                        this.username, 
                        componentRef.instance.id
                        );
          }
        })
      
      componentRef.instance['changed']
        .subscribe(async val => {
          if (val) {
            await this.cryptoChartService
                      .updateOnFirestore (
                        componentRef.instance.chartData, 
                        this.username, 
                        componentRef.instance.id
                        );
          }
        })
      this.currentComponent = componentRef;
    }
  }


  loadComponentCrypto(element) {
    const viewContainerRef = this.cryptoCharts.viewContainerRef;
    const componentRef = viewContainerRef
        .createComponent<DashComponent>(element.component);
      componentRef
        .instance.chartData = element.data;
      componentRef
        .instance.id = element.id;

      this.cryptoComponents.push(componentRef); 

      componentRef.instance['deleted']
        .subscribe(async val => {
          if (val) {
            componentRef.destroy();
            await this.dashboardService
                      .clearFromFirestoreCrypto (
                          componentRef.instance['chartData']['name'], 
                          this.username, 
                          componentRef.instance.id
                          );
          }
        })

      componentRef.instance['changed']
        .subscribe(async val => {
          if (val) {
            await this.cryptoChartService
                      .updateOnFirestore (
                        componentRef.instance.chartData, 
                        this.username, 
                        componentRef.instance.id
                        );
          }
        })

    this.currentComponent = componentRef;
  }

  async createCryptoComponent(){

    let id; 
    if (this.cryptoS.length!= 0){
      id = (parseInt(this.currentComponent.instance.id) + 1).toString();
    }
    else {
      id = "0";
    }

    let tmp;
    tmp = this.cryptoChartService
              .getCharts1(id);
    await this.cryptoChartService
              .storeOnFirestore(tmp, this.username, id);

    setTimeout(async () => {

      this.loadComponentCrypto(tmp);
    
      setTimeout(() => {
        let renderer = this.currentComponent.instance['renderer'];
        renderer.setStyle(this.currentComponent.instance['editBtns'].nativeElement,'display', 'flex'); 
        this.STARTeditDashInterface();      
      }, 25);
   
    }, 200) 
  } 


  loadComponentStocks(){
    for (const element in this.stockS){
      const viewContainerRef = this.stocksCharts.viewContainerRef;
  
      const componentRef = viewContainerRef.
      createComponent<DashComponent>(this.stockS[element].component);
      componentRef.instance.chartData = this.stockS[element].data; 
    }
  }

  loadComponentFootball(){
    for (const element in this.footballS){
      const viewContainerRef = this.footballInfo.viewContainerRef;
      const componentRef = viewContainerRef.
      createComponent<DashComponent>(this.footballS[element].component);
      componentRef.instance.chartData = this.footballS[element].data;
      
    }
  }

  STARTeditDashInterface(){
    this.renderer.setStyle(this.editBtn.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.finishBtn.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.subBtnContainer1.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.messEditMode.nativeElement, 'display', 'block');
    for (const component in this.cryptoComponents){
      let renderer = this.cryptoComponents[component].instance['renderer'];
      renderer.setStyle(this.cryptoComponents[component].instance['editBtns'].nativeElement,'display', 'flex');
    }
  }


   ENDeditDashInterface(){
    this.renderer.setStyle(this.editBtn.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.finishBtn.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.subBtnContainer1.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.messEditMode.nativeElement, 'display', 'none');
    for (const component in this.cryptoComponents){
      let renderer = this.cryptoComponents[component].instance['renderer'];
      renderer.setStyle(this.cryptoComponents[component].instance['editBtns'].nativeElement,'display', 'none');
      renderer.setStyle(this.cryptoComponents[component].instance['popupDeleteContainer'].nativeElement, 'display', 'none');
    }
  }


  closeAlert(){
    this.renderer.setStyle(this.messEditMode.nativeElement, 'display', 'none');
  }
}
