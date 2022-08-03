import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[T2StockB]',
})

export class T2StockB {
    constructor (public viewContainerRef: ViewContainerRef) {}
}