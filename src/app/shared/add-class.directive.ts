import { Directive, Input, ElementRef, OnInit } from "@angular/core";

@Directive({
  selector: "[rtAddClass]",
})
export class AddClassDirective implements OnInit {
  @Input() value: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.className += " " + this.value;
  }
}
