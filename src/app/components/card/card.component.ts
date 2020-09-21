import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  Renderer2,
  Output,
  EventEmitter,
} from "@angular/core";
import { Card } from "../../models/Card";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styles: [
    `
      i.delete {
        display: none;
        color: darkgrey;
      }
      #cardContent:hover i.delete {
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    `,
  ],
})
export class CardComponent {
  @ViewChild("cardContent") cardContent: ElementRef;
  @ViewChild("cardContentEdit") cardContentEdit: ElementRef;
  @Output() cardDelete = new EventEmitter();
  @Output() cardUpdate = new EventEmitter();
  @Input()
  columnId: string;
  @Input()
  card: Card;
  cardText: string;
  isEditing = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  captureCardSize() {
    if (this.cardContent && this.cardContentEdit) {
      var height = `${this.cardContent.nativeElement.offsetHeight}px`;
      this.renderer.setStyle(
        this.cardContentEdit.nativeElement,
        "height",
        height
      );
    }
  }

  editCard() {
    this.isEditing = true;
    this.cardText = this.card.text;

    let textArea = this.el.nativeElement.getElementsByTagName("textarea")[0];

    setTimeout(function () {
      textArea.focus();
    }, 0);
  }

  clearCardEdit() {
    this.card.text = this.cardText;
    this.isEditing = false;
  }

  blurOnEnter(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    } else if (event.keyCode === 27) {
      this.card.text = this.cardText;
      this.isEditing = false;
    }
  }

  updateCardOnEnter(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.updateCard();
    } else if (event.keyCode === 27) {
      this.clearCardEdit();
    }
  }

  updateCardOnBlur() {
    if (this.isEditing) {
      this.updateCard();
      this.clearCardEdit();
    }
  }

  updateCard() {
    if (this.card.text && this.card.text.trim() !== "") {
      this.cardUpdate.emit(this.card);
      this.isEditing = false;
    } else {
      this.clearCardEdit();
    }
  }

  onCardDelete() {
    this.cardDelete.emit(this.card);
  }
}
