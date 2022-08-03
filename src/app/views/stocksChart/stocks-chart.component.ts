import { Component, OnInit, ViewChild, ElementRef, Input, Renderer2, Output, EventEmitter} from '@angular/core';
import { stocksChartService } from './stocks-chart.service'
import { CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips'


@Component({
  selector: '[app-stocks-chart].col-6, app-stocks-browser',
  templateUrl: './stocks-chart.component.html',
  styleUrls: ['./stocks-chart.component.scss']
})
export class stocksChartComponent implements OnInit {

  @ViewChild('holding') holding;
  @ViewChild('editBtns') editBtns: ElementRef;
  @ViewChild('popupDeleteContainer') popupDeleteContainer: ElementRef;
  @ViewChild('popupDelete') popupDelete;
  @ViewChild('customPopup') customPopup;
  @ViewChild('customPopupContainer') customPopupContainer: ElementRef;


  @Output() deleted = new EventEmitter<boolean>();
  @Output() changed = new EventEmitter<boolean>();

  @Input() chartData;
  // getting selectedOption from DashboardComponent

  name;
  bgcolor; 
  type;
  setRadius = 4;

  constructor( public chart : stocksChartService, 
               private renderer : Renderer2   
             ) {}


  instanceIsDeleted = false;
  cryptoChartInfo: string;

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
          this.chartData.bgcolor = this.customPopup.bgcolor;
          this.chartData.type = this.customPopup.type;
          this.type = this.customPopup.type;
          this.name = this.customPopup.name;
          this.tmpColor = this.bgcolor;
          this.chartData.bgcolor = this.customPopup.bgcolor;
          this.chartData.setRadius = this.customPopup.pointRadius;
          this.setRadius = this.customPopup.pointRadius;
          this.holding.nativeElement.classList.remove("bg-primary");
          this.holding.nativeElement.classList.remove(this.tmpColor);
          this.holding.nativeElement.classList.add(this.chartData.bgcolor);
          this.changed.emit(this.sub);
          this.displayData();
          this.setColours();
          this.setPointRadius();
          this.setChartType();
          this.renderer.setStyle(this.customPopupContainer.nativeElement, 'display', 'none');
          this.sub = false;
        }
      });
    this.renderer.setStyle(this.customPopupContainer.nativeElement, 'display', 'flex');
    this.customPopup.ngOnInit();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      for (const e in this.chart.tickers){
        this.options.push({"name": this.chart.tickers[e]});
      }
    },700)
    this.holding.nativeElement.classList.add(this.bgcolor);
  }

  options = [];

  ngOnInit(): void {
    this.name=this.chartData.name;
    this.bgcolor=this.chartData.bgcolor;
    this.type=this.chartData.type;
    this.setRadius=this.chartData.pointRadius;

    this.setColours();
    this.setPointRadius();
    this.displayData();
  
  }

  setChartType(){
    if (this.type == 'line')
      this.setToLine();
    else
    if (this.type == 'bar')
      this.setToBar();
  }

  setToLine(){
    this.type = 'line';
    this.setColours();
  }

  setToBar(){
    this.type = 'bar';
    this.setColours();
  }
  

  setPointRadius(){
        this.lineChart1Options['elements']['point']['radius']=this.setRadius;
  }

  setColours(){
    if (this.type == 'bar'){
      this.lineChart1Colours = [
      {
        backgroundColor: 'red',
        borderColor: 'red',
        pointHoverBackgroundColor: 'red'
        
      },
      {
        backgroundColor: 'green',
        borderColor: 'green',
        pointHoverBackgroundColor: 'green'
      },
      {
        backgroundColor: 'orange',
        borderColor: 'orange',
        pointHoverBackgroundColor: 'orange'
      }
    ]
    return true
  }
   else {
    this.lineChart1Colours = [
      {
        backgroundColor: 'transparent',
        borderColor: 'red',
        pointHoverBackgroundColor: 'red'
        
      },
      {
        backgroundColor: 'transparent',
        borderColor: 'green',
        pointHoverBackgroundColor: 'green'
      },
      {
        backgroundColor: 'transparent',
        borderColor: 'orange',
        pointHoverBackgroundColor: 'orange'
      }
    ]
    return false;
   }
  }

  displayData(){
    this.lineChart1Data1.splice(0,this.lineChart1Data1.length);
    this.lineChart1Data2.splice(0,this.lineChart1Data2.length);
    this.lineChart1Data3.splice(0,this.lineChart1Data3.length);
    this.lineChart1Labels.splice(0,this.lineChart1Labels.length);
    let data = this.chart.new(this.name);
    var i = 1;
    data
    .subscribe(result => {
      result['results'].forEach(element => {
        this.cryptoChartInfo = 'Trend this month (' + result['resultsCount']+' records).';
        this.lineChart1Data1.unshift(element['o']);
        this.lineChart1Data2.unshift(element['h']);
        this.lineChart1Data3.unshift(element['c']);
        this.lineChart1Labels.push((i++).toString());
      })
    })
  }

  public lineChart1Data1 : Array<number> = [];
  public lineChart1Data2 : Array<number> = [];
  public lineChart1Data3 : Array<number> = [];
  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: this.lineChart1Data1,
      label: 'open',
    },
    {
      data: this.lineChart1Data2,
      label: 'high'
    },
    {
      data: this.lineChart1Data3,
      label: 'close'
    }
  ];
  public lineChart1Labels: Array<any> = [];
  public lineChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true
      }
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: this.setRadius,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };

  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: 'red',
      pointHoverBackgroundColor: 'red'
      
    },
    {
      backgroundColor: 'transparent',
      borderColor: 'green',
      pointHoverBackgroundColor: 'green'
    },
    {
      backgroundColor: 'transparent',
      borderColor: 'orange',
      pointHoverBackgroundColor: 'orange'
    }
  ];

  public lineChart1Legend = false;

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

}
