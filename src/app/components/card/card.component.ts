import {
  Component,
  Input,
  ElementRef,
  EventEmitter,
  ViewChild,
  Renderer2,
  Output,
} from "@angular/core";
import { Card } from "../../models/index";

interface CardEvent {
  type: string;
  data: Card;
}

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styles: [
    `
      i.delete {
        display: none;
        color: darkgrey;
      }
      #content:hover i.delete {
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    `,
  ],
})
export class CardComponent {
  // Data flow: CardComponent -> ColumnComponent -> DashboardComponent
  @Output() cardEvent = new EventEmitter<CardEvent>();
  @Input() card: Card;
  @ViewChild("content") content: ElementRef;
  @ViewChild("container") container: ElementRef;

  text: string;
  isEditing = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  canUpdate() {
    return this.text && this.text.trim() !== "" && this.text !== this.card.text;
  }

  saveSize() {
    if (this.content && this.container) {
      var height = `${this.content.nativeElement.offsetHeight}px`;
      this.renderer.setStyle(this.container.nativeElement, "height", height);
    }
  }

  onEdit() {
    this.isEditing = true;
    this.text = this.card.text;

    let textarea = this.el.nativeElement.getElementsByTagName("textarea")[0];

    setTimeout(function () {
      textarea.focus();
    }, 0);
  }

  onEnter(event) {
    if (event.key === "Enter") {
      event.target.blur();
    } else if (event.key === "Escape") {
      this.cancelUpdate();
    }
  }

  onBlur() {
    if (this.card.text.length === 0) this.delete();
    else if (this.canUpdate()) {
      this.update();
      this.isEditing = false;
    } else {
      this.cancelUpdate();
    }
  }

  update() {
    this.cardEvent.emit({ type: "update", data: this.card });
  }

  cancelUpdate() {
    this.card.text = this.text;
    this.isEditing = false;
  }

  delete() {
    this.cardEvent.emit({ type: "delete", data: this.card });
  }
}
