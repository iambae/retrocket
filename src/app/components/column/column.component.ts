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
 * ColumnComponent 
 * - can only update its name or add new card 
 * - passes delete and update events from CardComponent to BoardComponent
 * - all events are emitted to BoardComponent to handle db transactions
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
  colName: string;
  isAddingCard = false;
  cardText: string;
  isAuthor: boolean;

  constructor(private el: ElementRef) {
	  // Only board authors can edit column names
    this.isAuthor = !JSON.parse(sessionStorage.getItem("user")).isAnonymous;
  }

  canAddCard() {
    return this.cardText && this.cardText.trim() !== "";
  }

  editColumn() {
    this.colName = this.column.name;
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
    if (
      this.column.name &&
      this.column.name.trim() !== "" &&
      this.colName !== this.column.name
    ) {
      this.update.emit(this.column);
      this.isEditingCol = false;
    } else {
      this.cancelColumnUpdate();
    }
  }

  cancelColumnUpdate() {
    this.column.name = this.colName;
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

  /**
   * Emit to BoardComponent card update and delete events 
   * emitted by CardComponent; card add events are initiated
   * by ColumnComponent in onCardAddEvent()
   * @param data {type: 'update' | 'delete', data: Card}
   */
  onCardEvent(data) {
    this.cardEvent.emit(data);
  }

  onCardAddEvent() {
    this.cardEvent.emit({
      type: "add",
      data: {
        text: this.cardText,
        order: this.cards.length,
        colId: this.column.order,
      },
    });
  }

  resetCardInput() {
    this.isAddingCard = false;
    this.cardText = "";
  }
}
