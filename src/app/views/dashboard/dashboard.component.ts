import { Component, OnInit, ViewChild, Renderer2, OnDestroy, OnChanges, HostListener, ComponentRef, SimpleChanges, ElementRef, KeyValueDiffers, DoCheck } from '@angular/core';

import { DashChart } from './DashChart';

import { cryptoDirective } from '../cryptoChart/crypto.directive';
import { cryptoChartService } from '../cryptoChart/crypto-chart.service';

import { stocksDirective } from '../stocksChart/stocks.directive'; 
import { stocksChartService } from '../stocksChart/stocks-chart.service';

import { footballDirective } from '../footballWidget/football.directive';
import { FootballWidgetService } from '../footballWidget/football-widget.service';

import { DashComponent } from './dashComponent';
import { DashboardService } from './dashboard.service';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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


  differ: any;

  constructor(
    private cryptoChartService: cryptoChartService,
    private stocksChartService: stocksChartService,
    private footballWidgetService: FootballWidgetService,
    private dashboardService: DashboardService,
    private renderer: Renderer2,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
  }

  username = localStorage.getItem('displayName');

  letsGo;
  cryptoS: DashChart[] = [];
  stockS: DashChart[] = [];
  footballS: DashChart[] = [];
  async ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');
    await this.dashboardService.getUserSettings(accessToken, this.username);

    setTimeout(() => {
      this.cryptoS = this.cryptoChartService.charts;
      // this.stockS = this.stocksChartService.charts;
      // this.footballS = this.footballWidgetService.charts;
      this.loadComponentCrypto();
      // this.loadComponentStocks();
      // this.loadComponentFootball()
    }, 400);
  }

  cryptoComponents : Array<ComponentRef<DashComponent>> =[];

  loadComponentCrypto(){
    this.spinnerContainer.nativeElement.style.setProperty('display','none');
    for (const element in this.cryptoS){
    const viewContainerRef = this.cryptoCharts.viewContainerRef;
    const componentRef = viewContainerRef.
    createComponent<DashComponent>(this.cryptoS[element].component);
    componentRef.instance.chartData = this.cryptoS[element].data;
    componentRef.instance.id = element;
    this.cryptoComponents.push(componentRef);
            console.log("this", element);
    console.log(componentRef);
    componentRef.instance['deleted'].subscribe(val => {
      if (val) {
        console.log("this", element);
        componentRef.destroy();
        console.log(componentRef.instance['chartData']['name']);
        this.dashboardService.clearFromFirestoreCrypto(componentRef.instance['chartData']['name'], this.username, componentRef.instance.id);
        console.log(this.cryptoS);
      }
    })
    this.currentComponent = componentRef;
    }
}

  currentComponent;

  async requestComponent(){
    let id;
    if (this.cryptoS.length!= 0){
      id = (this.currentComponent.instance.id + 1).toString();
    }
    else {
      id = "0";
    }
    this.cryptoS = [];
    this.cryptoS = await this.cryptoChartService.getCharts1(id);
    setTimeout(async () => {
    await this.loadComponentCrypto();
    this.cryptoChartService.storeOnFirestore(this.cryptoS, this.username);
    setTimeout(() => {
      let renderer = this.currentComponent.instance['renderer'];
      renderer.setStyle(this.currentComponent.instance['editBtns'].nativeElement,'display', 'flex');    
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

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
    }
  }



  closeAlert(){
    this.renderer.setStyle(this.messEditMode.nativeElement, 'display', 'none');
  }
}
