import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[T2Crypto]',
})

export class T2Crypto {
    constructor (public viewContainerRef: ViewContainerRef) {}
}