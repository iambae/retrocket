import {
  Component,
  Input,
  EventEmitter,
  ElementRef,
  ViewChild,
  Output,
} from "@angular/core";
import { Column, Card } from "../../models/index";

/**
 * ColumnComponent:
 * - should not reference Card type
 * - is a static, "dumb" component
 * - can only have its title updated
 * - passes data from CardComponent to DashboardComponent
 */
@Component({
  selector: "app-column",
  templateUrl: "./column.component.html",
})
export class ColumnComponent {
  @Input() column: Column;
  @Input() cards: Card[];
  @Output() update = new EventEmitter<Column>();
  @Output() cardEvent = new EventEmitter<any>();
  @ViewChild("cardInputRef") cardInputRef: ElementRef;

  isEditingCol = false;
  colTitle: string;
  isAddingCard = false;
  cardText: string;

  constructor(private el: ElementRef) {}

  canAddCard() {
    return this.cardText && this.cardText.trim() !== "";
  }

  editColumn() {
    this.colTitle = this.column.title;
    this.isEditingCol = true;
    const input = this.el.nativeElement
      .getElementsByClassName("column-header")[0]
      .getElementsByTagName("input")[0];

    setTimeout(function () {
      input.focus();
    }, 0);
  }

  updateColumnOnEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.updateColumn();
    } else if (event.key === "Escape") {
      this.cancelColumnUpdate();
    }
  }

  updateColumnOnBlur() {
    if (this.isEditingCol) {
      this.updateColumn();
      this.resetCardInput();
    }
  }

  updateColumn() {
    if (this.column.title && this.column.title.trim() !== "") {
      this.update.emit(this.column);
      this.isEditingCol = false;
    } else {
      this.cancelColumnUpdate();
    }
  }

  cancelColumnUpdate() {
    this.column.title = this.colTitle;
    this.isEditingCol = false;
  }

  enableAddCard() {
    this.isAddingCard = true;
    const textarea = this.el.nativeElement
      .getElementsByClassName("add-card")[0]
      .getElementsByTagName("textarea")[0];

    setTimeout(function () {
      textarea.focus();
    }, 0);
  }

  onKeyUp(event: KeyboardEvent) {
    const cardInput = this.cardInputRef.nativeElement;
    cardInput.style.overflow = "hidden";
    cardInput.style.height = "0px";
    cardInput.style.height = cardInput.scrollHeight + "px";

    if (event.key === "Enter") {
      this.addCard();
    } else if (event.key === "Escape") {
      this.resetCardInput();
    }
  }

  onBlur() {
    this.addCard();
  }

  addCard() {
    if (this.canAddCard()) {
      this.cardText = this.cardText.trim();
      this.onCardAddEvent();
    }
    this.resetCardInput();
  }

  // Emit card update and delete events
  onCardEvent(data) {
    this.cardEvent.emit(data);
  }

  // Emit card add event
  onCardAddEvent() {
    this.cardEvent.emit({
      type: "add",
      data: {
        text: this.cardText,
        order: this.cards.length,
        colId: this.column.id,
      },
    });
  }

  resetCardInput() {
    this.isAddingCard = false;
    this.cardText = "";
  }
}
