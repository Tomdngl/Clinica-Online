import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCartasPacientesAdmin]'
})
export class CartasPacientesAdminDirective {

  @HostListener('mouseenter', ['$event'])
  onEnter(event: any) {
    // Obtenemos el elemento que contiene el texto
    const element = event.target;

    // Le agregamos un borde para crear el efecto de iluminación
    element.style.boxShadow = '0 0 30px black';
  }

  @HostListener('mouseleave', ['$event'])
  onLeave(event: any) {
    const element = event.target;
    element.style.border = '';
    element.style.boxShadow = '';
  }
}
