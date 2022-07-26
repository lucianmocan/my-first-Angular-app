import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { DashChart } from './DashChart';

import { cryptoDirective } from '../cryptoChart/crypto.directive';
import { cryptoChartService } from '../cryptoChart/crypto-chart.service';

import { stocksDirective } from '../stocksChart/stocks.directive'; 
import { stocksChartService } from '../stocksChart/stocks-chart.service';

import { footballDirective } from '../footballWidget/football.directive';
import { FootballWidgetService } from '../footballWidget/football-widget.service';

import { DashComponent } from './dashComponent';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  

  @ViewChild(cryptoDirective, { static: false}) cryptoCharts: cryptoDirective;
  @ViewChild(stocksDirective, { static: false }) stocksCharts: stocksDirective;
  @ViewChild(footballDirective, { static: false }) footballInfo: footballDirective;

  constructor(
    private cryptoChartService: cryptoChartService,
    private stocksChartService: stocksChartService,
    private footballWidgetService: FootballWidgetService
  ) {}

  cryptoS: DashChart[] = [];
  stockS: DashChart[] = [];
  footballS: DashChart[] = [];
  ngOnInit() {
    this.cryptoS = this.cryptoChartService.getCharts();
    this.stockS = this.stocksChartService.getCharts();
    // this.footballS = this.footballWidgetService.getCharts();
  }


  ngAfterViewInit(): void {

    setTimeout(() => {
      this.loadComponentCrypto();
      this.loadComponentStocks();
      // this.loadComponentFootball()
      }, 200);
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
    console.log(this.footballS);
    for (const element in this.footballS){
      const viewContainerRef = this.footballInfo.viewContainerRef;
      const componentRef = viewContainerRef.
      createComponent<DashComponent>(this.footballS[element].component);
      componentRef.instance.chartData = this.footballS[element].data;
  
    }
  }


  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


}
