import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyFormat]',
  //standalone: true
})
export class CurrencyFormatDirective {

  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef, private control: NgControl) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const formattedValue = this.formatCurrency(value);
    this.control.control?.setValue(formattedValue, { emitEvent: false });
    this.el.value = formattedValue;
  }

  private formatCurrency(value: string): string {
    value = value.replace(/\D/g, '');
    const numberValue = parseFloat(value) / 100;
    return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}