import { Component, OnInit, ViewChild, Renderer2, OnDestroy, OnChanges, HostListener, ComponentRef, SimpleChanges, ElementRef, KeyValueDiffers, DoCheck, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';

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


import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DataService } from 'src/app/data.service';

import { GridsterConfig, GridsterItem } from 'angular-gridster2';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  options: GridsterConfig;
  dashboard: Array<GridsterItem>;

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
    private data: DataService
  ) {
  }
  indexArray : Array<number> = [];

  async drop(event: CdkDragDrop<string[]>){
    let thisRef;
    let initIndex;
    for (const element in this.stockComponents){
      this.indexArray.push(this.stockComponents[element].instance.id);
      initIndex = this.stocksCharts.viewContainerRef.indexOf(this.stockComponents[element].hostView);
      if (initIndex == event.previousIndex){
        thisRef = this.stocksCharts.viewContainerRef.get(initIndex);
      }
    }
    this.stocksCharts.viewContainerRef.move(thisRef, event.currentIndex);
    moveItemInArray(this.stockComponents, event.previousIndex, event.currentIndex);
    this.stockComponents[event.currentIndex].instance.id = event.currentIndex.toString();
    this.componentIdUpdate();
    this.stocksChartService.switchPlaces(this.stockComponents, this.username)
  }

  componentIdUpdate(){
    for (const element in this.stockComponents) {
      this.stockComponents[element].instance.id = this.indexArray[element];
    }
  }

  username = localStorage.getItem('displayName');
  accessToken = localStorage.getItem('accessToken');
  widgetBrowser; widgetBrowserContainer;
  cryptoS: DashChart[] = [];
  cryptoComponents : Array<ComponentRef<DashComponent>> =[];
  currentCryptoComponent : ComponentRef<DashComponent>;

  async ngAfterViewInit(){
    }

  subSend: Subscription;

  changedOptions(){
    this.options.api.optionsChanged();
  }

  async ngOnInit() {
    this.options = {
      displayGrid :'always'
      // itemChangeCallback: DashboardComponent.itemChange,
      // itemResizeCallback: DashboardComponent.itemResize
    };
      this.dashboard = [
        {cols: 2, rows: 1, y: 0, x: 0},
        {cols: 2, rows: 2, y: 0, x: 2}
      ]
    await this.dashboardService.getUserSettings(this.accessToken, this.username);

    this.subscription = this.data.currentMessage.subscribe(message => this.message = message);
    this.subSend = this.data.currentShow.subscribe(message => {
      this.widgetBrowser = message[0];
      this.widgetBrowserContainer = message[1];
    });
      this.stocksChartService.getTickersNASDAQ();
    this.checkNetworkStatus();

    setTimeout(() => {
      this.cryptoS = this.cryptoChartService.charts;
      this.loadComponentsCrypto();
    }, 400);

    setTimeout(() => {
      this.stockS = this.stocksChartService.charts;
      this.loadComponentsStocks();
    }, 1000);

    // setTimeout(() => {
    //   this.footballS = this.footballWidgetService.charts;
    //   this.loadComponentsFootball();
    //   console.log(this.footballS)
    // }, 1000);
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.networkStatus$.unsubscribe();
    this.subSend.unsubscribe();
  }

  message: string;
  subscription: Subscription;

  createCrypto = true;
  createStock = true;
  createFootball = true;

  callWidgetBrowser(){
    this.displayWidgetBrowser();
    console.log('am fost');
    this.data.changeMessage('changed');
  }
  displayWidgetBrowser(){
    console.log('hello');
    this.createCrypto = true;
    this.createStock = true;
    this.createFootball = true;
    console.log(this.widgetBrowser);
    this.widgetBrowser.closed
      .subscribe(() => {
        console.log('here');
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
        this.createStock = false;
        this.renderer.setStyle(this.widgetBrowserContainer.nativeElement, 'display', 'none');
      }
    })

    // widgetBrowser.football
    // .subscribe(() => {
    //   if (this.createFootball) {
    //     this.createFootballComponent();
    //     this.renderer.setStyle(widgetBrowserContainer.nativeElement, 'display', 'none');
    //     this.createFootball = false;
    //   }
    // })
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

  async loadComponentsStocks(){
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
            const index = this.stockComponents.indexOf(componentRef);
              if (index > -1){
                this.stockComponents.splice(index, 1);
              }
            console.log(this.stockComponents);
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
    console.log(this.stocksCharts.viewContainerRef);
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
            const index = this.stockComponents.indexOf(componentRef);
            if (index > -1){
              this.stockComponents.splice(index, 1);
            }
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
