import { ComponentRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElementRef } from '@angular/core';
import { DashboardComponent } from './views/dashboard/dashboard.component';

@Injectable()
export class DataService {

    private messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();

    private showIn = new BehaviorSubject('hi');
    currentShow = this.showIn.asObservable();

    constructor() { }

    changeMessage(message: string){
        this.messageSource.next(message);
    }

    changeData(message){
        this.showIn.next(message);
    }
}