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
      #contentRef:hover i.delete {
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
  @ViewChild("contentRef") contentRef: ElementRef;
  @ViewChild("contentRefEdit") contentRefEdit: ElementRef;

  text: string;
  isEditing = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  saveSize() {
    if (this.contentRef && this.contentRefEdit) {
      var height = `${this.contentRef.nativeElement.offsetHeight}px`;
      this.renderer.setStyle(
        this.contentRefEdit.nativeElement,
        "height",
        height
      );
    }
  }

  edit() {
    this.isEditing = true;
    this.text = this.card.text;

    let textarea = this.el.nativeElement.getElementsByTagName("textarea")[0];

    setTimeout(function () {
      textarea.focus();
    }, 0);
  }

  blurOnEnter(event) {
    if (event.key === "Enter") {
      event.target.blur();
    } else if (event.key === "Escape") {
      this.card.text = this.text;
      this.isEditing = false;
    }
  }

  cancelUpdate() {
    this.card.text = this.text;
    this.isEditing = false;
  }

  // TODO: Merge with blurOnEnter()?
  updateOnEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.update();
    } else if (event.key === "Escape") {
      this.cancelUpdate();
    }
  }

  update() {
    if (this.card.text && this.card.text.trim() !== "") {
      this.cardEvent.emit({ type: "update", data: this.card });
      this.isEditing = false;
    } else {
      this.cancelUpdate();
    }
  }

  updateOnBlur() {
    if (this.isEditing) {
      this.update();
      this.cancelUpdate();
    }
  }

  delete() {
    this.cardEvent.emit({ type: "delete", data: this.card });
  }
}
