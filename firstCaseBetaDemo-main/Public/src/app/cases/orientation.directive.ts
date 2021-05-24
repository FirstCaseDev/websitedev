import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[orientation]',
})
export class OrientatioDirective {
  landscape = true;

  ngOnInit() {
    this.updateOrientatioState();
  }

  @HostListener('window:resize') updateOrientatioState() {
    if (window.innerHeight > window.innerWidth) {
      this.landscape = false;
    } else {
      this.landscape = true;
    }
  }
}
