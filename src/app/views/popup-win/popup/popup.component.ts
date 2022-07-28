import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Output() deleted = new EventEmitter<boolean>();
  @Output() keep = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  deleteWidget(changed: boolean){
    this.deleted.emit(changed);
  }
  keepWidget(changed: boolean){
    this.keep.emit(changed);
  }
}
