import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[appCommaSeparate]'
})
export class NumberFormatDirectiveComponent {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const num = value.replace(/,/g, ''); // Remove existing commas
    const parts = num.toString().split('.'); // Split the number into parts before and after decimal
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
    if (this.control && this.control.control) {
      this.control.control.setValue(parts.join('.')); // Set the value back to the control
    }
  }
}