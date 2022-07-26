import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[stocksCharts]',
})

export class stocksDirective {
    constructor (public viewContainerRef: ViewContainerRef) {}
}