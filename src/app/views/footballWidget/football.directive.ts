import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[footballInfo]',
})

export class footballDirective {
    constructor (public viewContainerRef: ViewContainerRef) {}
}