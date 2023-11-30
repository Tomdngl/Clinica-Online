import { Directive, ElementRef  } from '@angular/core';

@Directive({
  selector: '[appResaltarHover]'
})
export class ResaltarHoverDirective {

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.addEventListener('mouseenter', () => {
      this.el.nativeElement.style.backgroundColor = 'rgb(76, 153, 127)';
      this.el.nativeElement.style.cursor = 'pointer';
    });
    this.el.nativeElement.addEventListener('mouseleave', () => {
      this.el.nativeElement.style.backgroundColor = 'aquamarine';
      this.el.nativeElement.style.cursor = 'default';
    });
  }
}
