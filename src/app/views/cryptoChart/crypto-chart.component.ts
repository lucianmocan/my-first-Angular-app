import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import { cryptoChartService } from './crypto-chart.service'
import { CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { isNgTemplate } from '@angular/compiler';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-crypto-chart',
  templateUrl: './crypto-chart.component.html',
  styleUrls: ['./crypto-chart.component.scss']
})
export class cryptoChartComponent implements OnInit, AfterViewInit {

  // getting selectedOption from DashboardComponent
  @Input() selectedOption;

  @ViewChild('optionsTea') optionsTea: ElementRef;
  @ViewChild('datePicker') datePicker;
  @ViewChild('spinner') spinner;

  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    public chart : cryptoChartService) {}

  ngOnInit(): void {
    if (this.chart.month.length == 1) this.chart.month = '0'+this.chart.month;
  }

  ngAfterViewInit(){
    this.onSelected();
  }

  getStartDate(startDate: NgbDate){
    this.fromDate=startDate;
  }

  getEndDate(EndDate: NgbDate){
    this.toDate=EndDate;
  }

  onSelected() {
    this.spinner.nativeElement.style.setProperty('display','block');
    let callData = this.chart.new(this.selectedOption);

    if (this.myRadioModel == "Month"){
      this.datePicker.nativeElement.style.setProperty('display', 'none');
      this.createFinanceMonthChart(callData);
    }
    else
    if (this.myRadioModel == "Year"){
      this.datePicker.nativeElement.style.setProperty('display', 'none');
      this.createFinanceYearChart(callData);
    }
  }

  onCustom() {
    let callData = this.chart.new(this.selectedOption);
    this.spinner.nativeElement.style.setProperty('display','block');
    this.datePicker.nativeElement.style.setProperty('display', 'block');
    this.createFinanceCustomChart(callData);
  }

  createFinanceMonthChart(callData){
    this.myChartData1.splice(0,this.myChartData1.length);
    this.myChartData2.splice(0,this.myChartData2.length);
    this.myChartData3.splice(0,this.myChartData3.length);
    this.Dates.splice(0,this.Dates.length);

    callData
    .subscribe(result => {
      this.spinner.nativeElement.style.setProperty('display','none');
      let metadata = result['Meta Data'];
      let mySeries = result['Time Series (Digital Currency Daily)'];

      this.myChartTitle = metadata['2. Digital Currency Code'];
      this.myChartInfo = metadata['1. Information'];
      for (const element in mySeries){
          let dateM = this.chart.dateFormatMonth(element);
          let dateY = this.chart.dateFormatYear(element);
              if (dateM == this.chart.month && dateY == this.chart.year){
                this.Dates.unshift(this.chart.dateFormat(element));
                this.myChartData1.unshift(mySeries[element]['2a. high (EUR)']);
                this.myChartData2.unshift(mySeries[element]['1a. open (EUR)']);
                this.myChartData3.unshift(mySeries[element]['3a. low (EUR)']);
              } 
      }
    })
  }
  
  createFinanceYearChart(callData){
    this.myChartData1.splice(0,this.myChartData1.length);
    this.myChartData2.splice(0,this.myChartData2.length);
    this.myChartData3.splice(0,this.myChartData3.length);
    this.Dates.splice(0,this.Dates.length);

    callData
    .subscribe(result => {
      this.spinner.nativeElement.style.setProperty('display','none');
      let metadata = result['Meta Data'];
      let mySeries = result['Time Series (Digital Currency Daily)'];

      this.myChartTitle = metadata['2. Digital Currency Code'];
      this.myChartInfo = metadata['1. Information'];
      for (const element in mySeries){
          let dateY = this.chart.dateFormatYear(element);
              if (dateY == this.chart.year){
                this.Dates.unshift(this.chart.dateFormat(element));
                this.myChartData1.unshift(mySeries[element]['2a. high (EUR)']);
                this.myChartData2.unshift(mySeries[element]['1a. open (EUR)']);
                this.myChartData3.unshift(mySeries[element]['3a. low (EUR)']);
              } 
      }
    })

  }
  
  createFinanceCustomChart(callData){

    this.myChartData1.splice(0,this.myChartData1.length);
    this.myChartData2.splice(0,this.myChartData2.length);
    this.myChartData3.splice(0,this.myChartData3.length);
    this.Dates.splice(0,this.Dates.length);

    callData
    .subscribe(result => {
      this.spinner.nativeElement.style.setProperty('display','none');
      let metadata = result['Meta Data'];
      let mySeries = result['Time Series (Digital Currency Daily)'];

      let from = new Date(this.ngbDateParserFormatter.format(this.fromDate));
      let end = new Date(this.ngbDateParserFormatter.format(this.toDate));
      this.myChartTitle = metadata['2. Digital Currency Code'];
      this.myChartInfo = metadata['1. Information'];
      for (const element in mySeries){
          let date = new Date(element);
          if( from <= date && date <= end){
                this.Dates.unshift(this.chart.dateFormat(element));
                this.myChartData1.unshift(mySeries[element]['2a. high (EUR)']);
                this.myChartData2.unshift(mySeries[element]['1a. open (EUR)']);
                this.myChartData3.unshift(mySeries[element]['3a. low (EUR)']);
          } 
        }
    })
  }


  fromDate;
  toDate;

  options = [
    { name: "ETH", value: "ETH"  },
    { name: "BTC", value: "BTC" },
    { name: "DOGE", value: "DOGE" },
    { name: "SHIB", value: "SHIB" },
    { name: "ADA", value: "ADA" },
    { name: "DOT", value: "BNB" },
    { name: "XRP", value: "XRP" },
    { name: "UNI", value: "UNI" },
    { name: "THETA", value: "THETA"}
  ];

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
  
    /* tslint:disable:max-line-length */
    public myChartLabels: Array<any> = this.Dates; //['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    /* tslint:enable:max-line-length */



}
