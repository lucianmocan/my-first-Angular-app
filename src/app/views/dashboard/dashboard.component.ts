import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, OnChanges, HostListener, ComponentRef, SimpleChanges } from '@angular/core';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

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

  constructor(
    private cryptoChartService: cryptoChartService,
    private stocksChartService: stocksChartService,
    private footballWidgetService: FootballWidgetService,
    private dashboardService: DashboardService
  ) {}

  letsGo;
  cryptoS: DashChart[] = [];
  stockS: DashChart[] = [];
  footballS: DashChart[] = [];
  async ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');
    const username = localStorage.getItem('displayName');
    await this.dashboardService.getUserSettings(accessToken, username);

    setTimeout(() => {
      this.cryptoS = this.cryptoChartService.charts;
      this.stockS = this.stocksChartService.charts;
      this.footballS = this.footballWidgetService.charts;
      this.loadComponentCrypto();
      this.loadComponentStocks();
      this.loadComponentFootball()
    }, 400);
  }


  loadComponentCrypto(){
    for (const element in this.cryptoS){
    const viewContainerRef = this.cryptoCharts.viewContainerRef;
    const componentRef = viewContainerRef.
    createComponent<DashComponent>(this.cryptoS[element].component);
    componentRef.instance.chartData = this.cryptoS[element].data;
    }
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


}
