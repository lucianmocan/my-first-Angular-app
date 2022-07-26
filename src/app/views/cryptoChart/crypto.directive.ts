import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[cryptoCharts]',
})

export class cryptoDirective {
    constructor (public viewContainerRef: ViewContainerRef) {}
}