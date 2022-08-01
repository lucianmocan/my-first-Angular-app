import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: '<app-widget-browser>',
  templateUrl: './widget-browser.component.html',
  styleUrls: ['./widget-browser.component.scss'],
})
export class WidgetBrowserComponent implements OnInit, AfterViewInit {

  constructor (
    private renderer: Renderer2
  ) {}

  @Output() closed = new EventEmitter<boolean>();
  @Output() crypto = new EventEmitter<boolean>();
  @Output() stock = new EventEmitter<boolean>();
  @Output() football = new EventEmitter<boolean>();

  ngOnInit() {
  }

  ngAfterViewInit () {

  }

  closeWindow(changed: boolean){
    this.closed.emit(changed);
  }

  createCrypto(changed: boolean){
    this.crypto.emit(changed);
  }

  createStock(changed: boolean){
    this.stock.emit(changed);
  }

  createFootball(changed: boolean){
    this.football.emit(changed);
  }
}