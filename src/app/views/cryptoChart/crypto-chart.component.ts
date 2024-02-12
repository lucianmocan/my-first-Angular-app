import { Component, OnInit, ViewChild, Renderer2, ElementRef, Input, AfterViewInit, OnDestroy, HostBinding, Output, EventEmitter} from '@angular/core';
import { cryptoChartService } from './crypto-chart.service'
import { CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DashComponent } from '../dashboard/dashComponent';
import { DragAxis, Point } from '@angular/cdk/drag-drop';

@Component({
  selector: '[app-crypto-chart].col-6, app-crpyto-browser',
  templateUrl: './crypto-chart.component.html',
  styleUrls: ['./crypto-chart.component.scss'],
})
export class cryptoChartComponent implements OnInit, AfterViewInit, DashComponent {

  instanceIsDeleted = false;
  borderColor; name;

  // getting name from DashboardComponent
  @Input() chartData;
  @Input() id;

  @Input('cdkDragLockAxis')
  lockAxis: DragAxis

  @Input('cdkDragFreeDragPosition')
  freeDragPosition: Point

  @ViewChild('optionsTea') optionsTea: ElementRef;
  @ViewChild('datePicker') datePicker;
  @ViewChild('spinner') spinner;
  @ViewChild('border') border;
  @ViewChild('editBtns') editBtns: ElementRef;
  @ViewChild('popupDeleteContainer') popupDeleteContainer: ElementRef;
  @ViewChild('popupDelete') popupDelete;
  @ViewChild('customPopup') customPopup;
  @ViewChild('customPopupContainer') customPopupContainer: ElementRef;

  @Output() deleted = new EventEmitter<boolean>();
  @Output() changed = new EventEmitter<boolean>();

  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    public chart : cryptoChartService,
    private renderer: Renderer2
    ) {}


  showPopupDelete(){
    this.popupDelete.keep
      .subscribe(() => {
        this.renderer.setStyle(this.popupDeleteContainer.nativeElement, 'display', 'none');
      })
    this.popupDelete.deleted
      .subscribe((value) => {
        this.deleted.emit(value);
        this.instanceIsDeleted = true;
        this.renderer.setStyle(this.popupDeleteContainer.nativeElement, 'display', 'none');
      })
    this.renderer.setStyle(this.popupDeleteContainer.nativeElement, 'display', 'block');
  }

  sub:  boolean = true;
  tmpColor;

  showPopupCustomize(){
    this.sub = true;
    this.customPopup.discard
      .subscribe(() => {
        this.renderer.setStyle(this.customPopupContainer.nativeElement, 'display', 'none');
      });
    this.customPopup.change
      .subscribe(() => {
        if (this.sub) { 
          this.chartData.name = this.customPopup.name;
          this.chartData.borderColor = this.customPopup.borderColor;
          this.name = this.customPopup.name;
          this.tmpColor = this.borderColor;
          this.borderColor = this.customPopup.borderColor;
          this.changed.emit(this.sub);
          this.onSelected();
          this.renderer.setStyle(this.customPopupContainer.nativeElement, 'display', 'none');
          this.sub = false;
        }
      });
    this.renderer.setStyle(this.customPopupContainer.nativeElement, 'display', 'flex');
    this.customPopup.ngOnInit();
  }

  ngOnInit(): void {
    this.borderColor = this.chartData.borderColor;;
    this.name = this.chartData.name;
    if (this.chart.month.length == 1) this.chart.month = '0'+this.chart.month;
  }

  ngAfterViewInit(){
    this.onSelected();
  }

  setColors(){
    this.border.nativeElement.classList.remove('bg-danger');
    this.border.nativeElement.classList.remove(this.tmpColor);
    this.border.nativeElement.classList.add(this.borderColor);
  }

  getStartDate(startDate: NgbDate){
    this.fromDate=startDate;
  }

  getEndDate(EndDate: NgbDate){
    this.toDate=EndDate;
  }

  onSelected() {
    this.setColors();
    this.spinner.nativeElement.style.setProperty('display','block');
    let callData = this.chart.new(this.name);

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
    let callData = this.chart.new(this.name);
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
      console.log(result);
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

  colors = [
    { name: "dark blue", value: "bg-primary"},
    { name: "grey", value: "bg-secondary"}, 
    { name: "green", value: "bg-success"}, 
    { name: "red", value: "bg-danger"}, 
    { name: "yellow", value: "bg-warning"}, 
    { name: "light-blue", value: "bg-info"}, 
    { name: "white", value: "bg-light"}, 
    { name: "black", value: "bg-dark"}
  ]
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
