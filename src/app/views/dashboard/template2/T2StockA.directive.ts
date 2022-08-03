import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[T2StockA]',
})

export class T2StockA {
    constructor (public viewContainerRef: ViewContainerRef) {}
}