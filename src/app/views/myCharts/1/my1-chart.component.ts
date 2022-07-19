import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MyChartService } from '../my-chart.service'
import { CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { getLocaleDayNames } from '@angular/common';
import { MAX_VALUE_MILLIS } from '@firebase/util';


@Component({
  selector: 'app-my1-chart',
  templateUrl: './my1-chart.component.html',
  styleUrls: ['./my1-chart.component.scss']
})
export class My1ChartComponent implements OnInit {

  constructor(public chart : MyChartService) {}

  ngOnInit(): void {
    this.create();
    if (this.month.length == 1) this.month = '0'+this.month;

  }

  @ViewChild('optionsTea') optionsTea: ElementRef;

  selectedOption:string = "BTC";
  options = [
    { name: "BTC", value: "BTC" },
    { name: "ETH", value: "ETH"  },
    { name: "DOGE", value: "DOGE" },
    { name: "SHIB", value: "SHIB" }
  ];

  onSelected() {
    console.log(this.optionsTea.nativeElement.value);
    this.selectedOption = this.optionsTea.nativeElement.value;
    this.create();
  }


  d = new Date();
  day = this.d.getUTCDate();
  month = (this.d.getMonth()+1).toString();
  year = this.d.getFullYear().toString();


  dateFormatMonth (date: string) {
    let month = date.slice(5,7);
    return month;
  }

  dateFormatYear (date: string) {
    let year = date.slice(0,4);
    return year;
  }

  dateFormatDay (date: string) {
    let day = date.slice(8,10);
    return day;
  }

  dateFormat (date: string) {
    let day = date.slice(8,10);
    let month = date.slice(5,7);
    let year = date.slice(0,4);
    return day+"."+month+"."+year;
  }
    //currencySymbols = cryptocurrencies.symbols()[2];


    myRadioModel : string = 'Month';
  
    myChartTitle : any; myChartInfo: any;
  
    public myChartElements = 300;
    public myChartData1: Array<number> = [];
    public myChartData2: Array<number> = [];
    public myChartData3: Array<number> = [];
  
    Dates: Array<string> = [];
  
  
    public myChartData: Array<any> = [
      {
        data: this.myChartData1,
        label: 'high (EUR)'
      },
      {
        data: this.myChartData2,
        label: 'open (EUR)'
      },
      {
        data: this.myChartData3,
        label: 'low (EUR)'
      },
    ];
  
      public myChartOptions: any = {
        tooltips: {
          enabled: false,
          custom: CustomTooltips,
          intersect: true,
          mode: 'index',
          position: 'nearest',
          callbacks: {
            labelColor: function(tooltipItem, chart) {
              return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function(value: any) {
                return value;
              }
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              stepSize: Math.ceil(75 / 5),
              suggestedMin: 0
            }
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
      public myChartColours: Array<any> = [
        { // brandInfo
          backgroundColor: hexToRgba(getStyle('--info'), 10),
          borderColor: getStyle('--info'),
          pointHoverBackgroundColor: '#fff'
        },
        { // brandSuccess
          backgroundColor: 'transparent',
          borderColor: getStyle('--success'),
          pointHoverBackgroundColor: '#fff'
        },
        { // brandDanger
          backgroundColor: 'transparent',
          borderColor: getStyle('--danger'),
          pointHoverBackgroundColor: '#fff',
          borderWidth: 1
          // borderDash: [8, 5]
        }
      ];
      public myChartLegend = true;
      public myChartType = 'line';
  
      
      create (){
        let symbol: string = this.selectedOption;
        this.myChartData1.splice(0,this.myChartData1.length);
        this.myChartData2.splice(0,this.myChartData2.length);
        this.myChartData3.splice(0,this.myChartData3.length);
        this.Dates.splice(0,this.Dates.length);
        let data;
        data = this.chart.new(symbol);
        data.subscribe(result => {
          let metadata;
          let mySeries;

          metadata = result['Meta Data'];
          console.log(metadata);
          mySeries = result['Time Series (Digital Currency Daily)'];
    
          this.myChartTitle = metadata['2. Digital Currency Code'];
          this.myChartInfo = metadata['1. Information'];
          for (const element in mySeries){
              let dateM = this.dateFormatMonth(element);
              let dateY = this.dateFormatYear(element);
              let dateD = this.dateFormatDay(element);
              if (this.myRadioModel == 'Month'){
                  if (dateM == this.month && dateY == this.year){
                    this.Dates.unshift(this.dateFormat(element));
                    this.myChartData1.unshift(mySeries[element]['2a. high (EUR)']);
                    this.myChartData2.unshift(mySeries[element]['1a. open (EUR)']);
                    this.myChartData3.unshift(mySeries[element]['3a. low (EUR)']);
                  }
              }
              else
              if (this.myRadioModel == 'Year'){
                  if (dateY == this.year){
                    this.Dates.unshift(this.dateFormat(element));
                    this.myChartData1.unshift(mySeries[element]['2a. high (EUR)']);
                    this.myChartData2.unshift(mySeries[element]['1a. open (EUR)']);
                    this.myChartData3.unshift(mySeries[element]['3a. low (EUR)']);
                  }
              }
              else
              if (this.myRadioModel == 'Week'){
                  if (parseInt(dateD) >= (this.day)-7 && dateM == this.month && dateY == this.year){
                    this.Dates.unshift(this.dateFormat(element));
                    this.myChartData1.unshift(mySeries[element]['2a. high (EUR)']);
                    this.myChartData2.unshift(mySeries[element]['1a. open (EUR)']);
                    this.myChartData3.unshift(mySeries[element]['3a. low (EUR)']);
                  }
              }
            };
        })   
      }
    /* tslint:disable:max-line-length */
    public myChartLabels: Array<any> = this.Dates; //['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    /* tslint:enable:max-line-length */


}
