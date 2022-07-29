import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { } from '@angular/material'

@Component({
  selector: 'app-customize',
  standalone: true,
  templateUrl: './customize.component.html',
  styleUrls: ['./customize.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class CustomizeComponent implements OnInit {

  constructor() { }

  @Input() options;
  @Input() name;
  @Input() borderColor;
  @Input() colors;

  @ViewChild('discardBtn') discardBtn : ElementRef;
  @ViewChild('changeBtn') changeBtn : ElementRef;
  @ViewChild('main') main: ElementRef;


  @Output() change = new EventEmitter<boolean>();
  @Output() discard = new EventEmitter<boolean>();

  ngOnInit(): void {
    for (const c in this.colors){
      if (this.colors[c]['value'] == this.borderColor){
        this.borderColor = this.colors[c]['name'];
      }
    }
  }

  setName(){
  }

  setColor(){
  }

  discardChanges(){
    this.discard.emit(true);
  }

  makeChanges(){
    for (const c in this.colors){
      if (this.colors[c]['name'] == this.borderColor){
        this.borderColor = this.colors[c]['value'];
      }
    }
    this.change.emit(true);
  }
}
