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
})
export class CardComponent {
  // Data flow: CardComponent -> ColumnComponent -> BoardComponent
  @Output() cardEvent = new EventEmitter<CardEvent>();
  @Input() card: Card;
  @ViewChild("content") content: ElementRef; // most recent static card text
  @ViewChild("container") container: ElementRef; // textarea with editable content

  text: string;
  isEditing = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

/** 
 * Checks whether db write transaction should be made 
 * @returns {boolean}  true iif new card content is non-empty 
 * 					   and different from the previous 
 */
  canUpdate(): boolean {
    return this.text && this.text.trim() !== "" && this.text !== this.card.text;
  }

 /**
  * Sets size of textarea#container to size of span#content before displaying
  */
  saveSize() {
    if (this.content && this.container) {
      const height = `${this.content.nativeElement.offsetHeight}px`;
      this.renderer.setStyle(this.container.nativeElement, "height", height);
    }
  }

 /**
  * Initiates edit mode for this card 
  */
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
