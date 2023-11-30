import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLayoutFocus]'
})
export class LayoutFocusDirective {

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter', ['$event'])
  onEnter(event: any) {
    // Obtenemos el elemento que contiene el texto
    const element = event.target;

    // Le agregamos un borde para crear el efecto de iluminación
    element.style.border = '1px solid #fff';
  }

  @HostListener('mouseleave', ['$event'])
  onLeave(event: any) {
    const element = event.target;
    element.style.border = '';
  }
}
