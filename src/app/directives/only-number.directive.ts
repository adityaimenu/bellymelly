import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {

  constructor(private el: ElementRef) { }

  @Input() OnlyNumber: boolean;

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
    if ( initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
