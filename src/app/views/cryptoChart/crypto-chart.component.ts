import { Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { cryptoChartService } from './crypto-chart.service'
import { CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';


@Component({
  selector: 'app-crypto-chart',
  templateUrl: './crypto-chart.component.html',
  styleUrls: ['./crypto-chart.component.scss']
})
export class cryptoChartComponent implements OnInit {

  // getting selectedOption from DashboardComponent
  @Input() selectedOption;

  constructor(public chart : cryptoChartService) {}

  ngOnInit(): void {
    if (this.chart.month.length == 1) this.chart.month = '0'+this.chart.month;
    localStorage.setItem('request', '0');
    this.createFinanceChart();
  }

  @ViewChild('optionsTea') optionsTea: ElementRef;

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

  onSelected() {
    this.selectedOption = this.optionsTea.nativeElement.value;
    this.createFinanceChart();
  }

  createFinanceChart (){
    let symbol: string = this.selectedOption;

    this.myChartData1.splice(0,this.myChartData1.length);
    this.myChartData2.splice(0,this.myChartData2.length);
    this.myChartData3.splice(0,this.myChartData3.length);
    this.Dates.splice(0,this.Dates.length);
    
    let data;
    var i = parseInt(localStorage.getItem('request'));
    if (i > 15) {
      localStorage.setItem('request','0');
    }
    if (i < 5){
    data = this.chart.new(symbol, 'Url1');
    }
    else if (i >=5 && i < 10) {
      data = this.chart.new(symbol, 'Url2');
    }
    else if (i >=10){
      data = this.chart.new(symbol, 'Url3');
    }
    data.subscribe(result => {
      let metadata;
      let mySeries;

      i = parseInt(localStorage.getItem('request')); i++;
      localStorage.setItem('request',i.toString());

      metadata = result['Meta Data'];
      mySeries = result['Time Series (Digital Currency Daily)'];

      this.myChartTitle = metadata['2. Digital Currency Code'];
      this.myChartInfo = metadata['1. Information'];
      for (const element in mySeries){
          let dateM = this.chart.dateFormatMonth(element);
          let dateY = this.chart.dateFormatYear(element);
          let dateD = this.chart.dateFormatDay(element);
          if (this.myRadioModel == 'Month'){
              if (dateM == this.chart.month && dateY == this.chart.year){
                this.Dates.unshift(this.chart.dateFormat(element));
                this.myChartData1.unshift(mySeries[element]['2a. high (EUR)']);
                this.myChartData2.unshift(mySeries[element]['1a. open (EUR)']);
                this.myChartData3.unshift(mySeries[element]['3a. low (EUR)']);
              }
          }
          else
          if (this.myRadioModel == 'Year'){
              if (dateY == this.chart.year){
                this.Dates.unshift(this.chart.dateFormat(element));
                this.myChartData1.unshift(mySeries[element]['2a. high (EUR)']);
                this.myChartData2.unshift(mySeries[element]['1a. open (EUR)']);
                this.myChartData3.unshift(mySeries[element]['3a. low (EUR)']);
              }
          }
          else
          if (this.myRadioModel == 'Week'){
              if (parseInt(dateD) >= (this.chart.day)-7 && dateM == this.chart.month && dateY == this.chart.year){
                this.Dates.unshift(this.chart.dateFormat(element));
                this.myChartData1.unshift(mySeries[element]['2a. high (EUR)']);
                this.myChartData2.unshift(mySeries[element]['1a. open (EUR)']);
                this.myChartData3.unshift(mySeries[element]['3a. low (EUR)']);
              }
          }
        };
    })   
  }

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
