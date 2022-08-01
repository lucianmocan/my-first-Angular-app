import { Component, Input, ViewChild, OnInit, AfterViewInit, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { FootballWidgetService } from '../football-widget.service'
import { environment } from 'src/environments/environment';

@Component({
  selector: '[app-football-widget].col-sm-6.col-lg-3, football-widget-browser',
  templateUrl: './football-widget.component.html',
  styleUrls: ['./football-widget.component.scss']
})
export class FootballWidgetComponent implements OnInit, AfterViewInit {

  league;
  team;

  @Output() deleted = new EventEmitter<boolean>();
  @Output() changed = new EventEmitter<boolean>();

  @Input() chartData;

  @ViewChild('main') main: ElementRef;
  @ViewChild('info') info: ElementRef;
  @ViewChild('spinner') spinner: ElementRef;
  @ViewChild('editBtns') editBtns: ElementRef;
  @ViewChild('popupDeleteContainer') popupDeleteContainer: ElementRef;
  @ViewChild('popupDelete') popupDelete;
  @ViewChild('customPopup') customPopup;
  @ViewChild('customPopupContainer') customPopupContainer: ElementRef;

  homeLogo; awayLogo;
  homeLongName;
  homeShortName; awayShortName;

  instanceIsDeleted = false;

  matchResult;

  homeTeam; awayTeam;
  matchData;
  locationInfo;
  status;
  topLogo;
  matchDate;
  season;

  constructor(
    public widget: FootballWidgetService,
    private renderer: Renderer2
    ) { }

  ngOnInit(): void {
    this.league = this.chartData.league;
    this.team = this.chartData.team;

  }

  ngAfterViewInit(): void {
    this.createNewFootballCard(this.team);

  }

  createNewFootballCard(team){
      this.widget.getDataSeasonID(this.league)
      .subscribe(result => {
            
            var query = result['data'].filter(function(result){return result['is_current'] == 1});
            let seasonID = query['0']['season_id'];
            var url = `https://app.sportdataapi.com/api/v1/soccer/matches?apikey=${environment.sportsApi.apiKey}&season_id=${seasonID}`;
            
            this.widget.getDataMatchID(url)
            .subscribe(result => {
              var query = result['data'].filter(function(search){return search['home_team']['name'] == team || search['away_team']['name'] == team});
              var ndQuery = query.filter(function(search){return search['status'] == 'finished'});
              var matchId = ndQuery.pop();
              this.homeTeam = matchId['home_team'];
              this.awayTeam = matchId['away_team'];
              this.homeLogo = this.homeTeam['logo'];
              this.awayLogo = this.awayTeam['logo'];
              this.matchDate = matchId['match_start'].slice(0, 16);
              this.homeLongName = this.homeTeam['name'];
              if (this.homeLongName == team){
                this.topLogo = this.homeLogo;
              }
              else {
                this.topLogo = this.awayLogo;
              }
              this.homeShortName = this.homeTeam['short_code'];
              this.awayShortName = this.awayTeam['short_code'];
              this.matchResult = matchId['stats']['ft_score'];
              this.status = matchId ['status'];
              this.locationInfo = matchId['venue']['name']+". "+matchId['venue']['city'];
              this.renderer.setStyle(this.main.nativeElement, 'height', 'auto');
              this.renderer.setStyle(this.info.nativeElement, 'display','block');
              this.renderer.setStyle(this.spinner.nativeElement, 'display', 'none');
              })
            })
  }

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
    this.renderer.setStyle(this.popupDeleteContainer.nativeElement, 'display', 'flex');
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
          this.chartData.league = this.customPopup.league;
          this.chartData.team = this.customPopup.team;
          // this.chartData.borderColor = this.customPopup.borderColor;
          this.league = this.customPopup.league;
          this.team = this.customPopup.team;
          // this.tmpColor = this.borderColor;
          // this.borderColor = this.customPopup.borderColor;
          this.changed.emit(this.sub);
          this.createNewFootballCard(this.team);
          this.renderer.setStyle(this.customPopupContainer.nativeElement, 'display', 'none');
          this.sub = false;
        }
      });
    this.renderer.setStyle(this.customPopupContainer.nativeElement, 'display', 'flex');
    this.customPopup.ngOnInit();
  }


}
