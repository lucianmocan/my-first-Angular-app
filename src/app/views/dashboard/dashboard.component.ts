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
  @ViewChild('widgetBrowserContainer') widgetBrowserContainer: ElementRef;
  @ViewChild('widgetBrowser') widgetBrowser;

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

  cryptoS: DashChart[] = [];
  cryptoComponents : Array<ComponentRef<DashComponent>> =[];
  currentCryptoComponent : ComponentRef<DashComponent>;

  async ngOnInit() {
    this.stocksChartService.getTickersNASDAQ();
    this.checkNetworkStatus();
    await this.dashboardService.getUserSettings(this.accessToken, this.username);

    setTimeout(() => {
      this.cryptoS = this.cryptoChartService.charts;
      this.loadComponentsCrypto();
    }, 400);

    setTimeout(() => {
      this.stockS = this.stocksChartService.charts;
      this.loadComponentsStocks();
    }, 600);

    setTimeout(() => {
      this.footballS = this.footballWidgetService.charts;
      this.loadComponentsFootball();
      console.log(this.footballS)
    }, 1000);
  }


  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
  }

  createCrypto = true;
  createStock = true;
  createFootball = true;

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

  displayWidgetBrowser(){
    this.createCrypto = true;
    this.createStock = true;
    this.createFootball = true;

    this.widgetBrowser.closed
      .subscribe(() => {
        this.renderer.setStyle(this.widgetBrowserContainer.nativeElement, 'display', 'none');
      })

    this.widgetBrowser.crypto
      .subscribe(() => {
        if (this.createCrypto) {
          this.createCryptoComponent();
          this.renderer.setStyle(this.widgetBrowserContainer.nativeElement, 'display', 'none');
          this.createCrypto = false;
        }
      })

    this.widgetBrowser.stock
    .subscribe(() => {
      if (this.createStock) {
        this.createStocksComponent();
        this.renderer.setStyle(this.widgetBrowserContainer.nativeElement, 'display', 'none');
        this.createStock = false;
      }
    })

    this.widgetBrowser.football
    .subscribe(() => {
      if (this.createFootball) {
        this.createFootballComponent();
        this.renderer.setStyle(this.widgetBrowserContainer.nativeElement, 'display', 'none');
        this.createFootball = false;
      }
    })
    
    this.renderer.setStyle(this.widgetBrowserContainer.nativeElement, 'display', 'block');
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
      this.currentCryptoComponent = componentRef;
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

    this.currentCryptoComponent = componentRef;
  }

  async createCryptoComponent(){

    let id; 
    if (this.cryptoS.length!= 0){
      id = (parseInt(this.currentCryptoComponent.instance.id) + 1).toString();
    }
    else {
      id = "0";
    }

    let tmp;
    tmp = this.cryptoChartService
              .getChartsDefault(id);
    await this.cryptoChartService
              .storeOnFirestore(tmp, this.username, id);

    setTimeout(async () => {

      this.loadComponentCrypto(tmp);
    
      setTimeout(() => {
        let renderer = this.currentCryptoComponent.instance['renderer'];
        renderer.setStyle(this.currentCryptoComponent.instance['editBtns'].nativeElement,'display', 'flex'); 
        this.STARTeditDashInterface();      
      }, 25);
   
    }, 200) 
  } 


  stockComponents : Array<ComponentRef<DashComponent>> =[];
  stockS: DashChart[] = [];
  currentStockComponent : ComponentRef<DashComponent>;

  loadComponentsStocks(){
    const viewContainerRef = this.stocksCharts.viewContainerRef;
    viewContainerRef.clear();
    //* loading the components from the cloud & creating dynamically
    for (const element in this.stockS){
      const componentRef = viewContainerRef
        .createComponent<DashComponent>(this.stockS[element].component);
      componentRef
        .instance.chartData = this.stockS[element].data;
      componentRef
        .instance.id = this.stockS[element].id;

      //* using this to access components when editing but not good idea
      //* should check again from the cloud, in case changes were made
      
      this.stockComponents.push(componentRef); 

      componentRef.instance['deleted']
        .subscribe(async val => {
          if (val) {
            componentRef.destroy();
            await this.dashboardService
                      .clearFromFirestoreStock (
                        componentRef.instance['chartData']['name'], 
                        this.username, 
                        componentRef.instance.id
                        );
          }
        })
      
      componentRef.instance['changed']
        .subscribe(async val => {
          if (val) {
            await this.stocksChartService
                      .updateOnFirestore (
                        componentRef.instance.chartData, 
                        this.username, 
                        componentRef.instance.id
                        );
          }
        })
      this.currentStockComponent = componentRef;
    }
  }

  loadComponentStocks(element) {
    const viewContainerRef = this.stocksCharts.viewContainerRef;
    const componentRef = viewContainerRef
        .createComponent<DashComponent>(element.component);
      componentRef
        .instance.chartData = element.data;
      componentRef
        .instance.id = element.id;

      this.stockComponents.push(componentRef); 

      componentRef.instance['deleted']
        .subscribe(async val => {
          if (val) {
            componentRef.destroy();
            await this.dashboardService
                      .clearFromFirestoreStock (
                          componentRef.instance['chartData']['name'], 
                          this.username, 
                          componentRef.instance.id
                          );
          }
        })

      componentRef.instance['changed']
        .subscribe(async val => {
          if (val) {
            await this.stocksChartService
                      .updateOnFirestore (
                        componentRef.instance.chartData, 
                        this.username, 
                        componentRef.instance.id
                        );
          }
        })

    this.currentStockComponent = componentRef;
  }

  async createStocksComponent(){

    let id; 
    if (this.stockS.length!= 0){
      id = (parseInt(this.currentStockComponent.instance.id) + 1).toString();
    }
    else {
      id = "0";
    }

    let tmp;
    tmp = this.stocksChartService
              .getChartsDefault(id);
    console.log(tmp);
    await this.stocksChartService
              .storeOnFirestore(tmp, this.username, id);

    setTimeout(async () => {

      this.loadComponentStocks(tmp);
    
      setTimeout(() => {
        let renderer = this.currentStockComponent.instance['renderer'];
        renderer.setStyle(this.currentStockComponent.instance['editBtns'].nativeElement,'display', 'flex'); 
        this.STARTeditDashInterface();      
      }, 25);
   
    }, 200) 
  } 
  
  footballComponents : Array<ComponentRef<DashComponent>> =[];
  footballS: DashChart[] = [];
  currentFootballComponent : ComponentRef<DashComponent>;


  loadComponentsFootball(){
    console.log(this.footballS);
    const viewContainerRef = this.footballInfo.viewContainerRef;
    viewContainerRef.clear();
    //* loading the components from the cloud & creating dynamically
    for (const element in this.footballS){
      const componentRef = viewContainerRef
        .createComponent<DashComponent>(this.footballS[element].component);
      componentRef
        .instance.chartData = this.footballS[element].data;
      componentRef
        .instance.id = this.footballS[element].id;

      //* using this to access components when editing but not good idea
      //* should check again from the cloud, in case changes were made
      
      this.footballComponents.push(componentRef); 

      componentRef.instance['deleted']
        .subscribe(async val => {
          if (val) {
            componentRef.destroy();
            await this.dashboardService
                      .clearFromFirestoreFootball (
                        componentRef.instance['chartData']['name'], 
                        this.username, 
                        componentRef.instance.id
                        );
          }
        })
      
      componentRef.instance['changed']
        .subscribe(async val => {
          if (val) {
            await this.footballWidgetService
                      .updateOnFirestore (
                        componentRef.instance.chartData, 
                        this.username, 
                        componentRef.instance.id
                        );
          }
        })
      this.currentFootballComponent = componentRef;
    }
  }

  loadComponentFootball(element) {
    const viewContainerRef = this.footballInfo.viewContainerRef;
    const componentRef = viewContainerRef
        .createComponent<DashComponent>(element.component);
      componentRef
        .instance.chartData = element.data;
      componentRef
        .instance.id = element.id;

      this.footballComponents.push(componentRef); 

      componentRef.instance['deleted']
        .subscribe(async val => {
          if (val) {
            componentRef.destroy();
            await this.dashboardService
                      .clearFromFirestoreFootball (
                          componentRef.instance['chartData']['name'], 
                          this.username, 
                          componentRef.instance.id
                          );
          }
        })

      componentRef.instance['changed']
        .subscribe(async val => {
          if (val) {
            await this.footballWidgetService
                      .updateOnFirestore (
                        componentRef.instance.chartData, 
                        this.username, 
                        componentRef.instance.id
                        );
          }
        })

    this.currentFootballComponent = componentRef;
  }

  async createFootballComponent(){

    let id; 
    if (this.footballComponents.length!= 0){
      id = (parseInt(this.currentFootballComponent.instance.id) + 1).toString();
    }
    else {
      id = "0";
    }

    let tmp;
    tmp = this.footballWidgetService
              .getChartsDefault(id);
    console.log(tmp);
    await this.footballWidgetService
              .storeOnFirestore(tmp, this.username, id);

    setTimeout(async () => {

      this.loadComponentFootball(tmp);
    
      setTimeout(() => {
        let renderer = this.currentFootballComponent.instance['renderer'];
        renderer.setStyle(this.currentFootballComponent.instance['editBtns'].nativeElement,'display', 'flex'); 
        this.STARTeditDashInterface();      
      }, 25);
   
    }, 200) 
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
    for (const component in this.stockComponents){
      let renderer = this.stockComponents[component].instance['renderer'];
      renderer.setStyle(this.stockComponents[component].instance['editBtns'].nativeElement,'display', 'flex');
    }
    for (const component in this.footballComponents){
      let renderer = this.footballComponents[component].instance['renderer'];
      renderer.setStyle(this.footballComponents[component].instance['editBtns'].nativeElement,'display', 'flex');
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
    for (const component in this.stockComponents){
      let renderer = this.stockComponents[component].instance['renderer'];
      renderer.setStyle(this.stockComponents[component].instance['editBtns'].nativeElement,'display', 'none');
      renderer.setStyle(this.stockComponents[component].instance['popupDeleteContainer'].nativeElement, 'display', 'none');
    }
    for (const component in this.footballComponents){
      let renderer = this.footballComponents[component].instance['renderer'];
      renderer.setStyle(this.footballComponents[component].instance['editBtns'].nativeElement,'display', 'none');
      renderer.setStyle(this.footballComponents[component].instance['popupDeleteContainer'].nativeElement, 'display', 'none');
    }
  }


  closeAlert(){
    this.renderer.setStyle(this.messEditMode.nativeElement, 'display', 'none');
  }
}
