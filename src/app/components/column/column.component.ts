import { CardService } from "./../../services/card.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";
import { Component, Input, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ColumnService } from "./../../services/column.service";
import { Card } from "../../models/Card";
import { Column } from "../../models/Column";

@Component({
  selector: "app-column",
  templateUrl: "./column.component.html",
  styleUrls: ["./column.component.css"],
})
export class ColumnComponent implements OnInit {
  @Input() column: Column;
  @ViewChild("newCardInput") newCardInput: ElementRef;

  cards$: Observable<Card[]>;
  columnLength: number;
  isEditingTitle = false;
  columnTitle: string;
  isAddingCard = false;
  newCardText: string;

  constructor(
    private el: ElementRef,
    private columnService: ColumnService,
    private cardService: CardService
  ) {}

  ngOnInit() {
    this.cards$ = this.cardService.getCards(this.column.id);
    this.cards$.subscribe((cards) => (this.columnLength = cards.length));
  }

  editColumn() {
    this.columnTitle = this.column.title;
    this.isEditingTitle = true;
    const input = this.el.nativeElement
      .getElementsByClassName("column-header")[0]
      .getElementsByTagName("input")[0];

    setTimeout(function () {
      input.focus();
    }, 0);
  }

  updateColumnOnEnter(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.updateColumn();
    } else if (event.keyCode === 27) {
      this.clearColumnEdit();
    }
  }

  updateColumnOnBlur() {
    if (this.isEditingTitle) {
      this.updateColumn();
      this.clearCardAdd();
    }
  }

  updateColumn() {
    if (this.column.title && this.column.title.trim() !== "") {
      this.columnService.updateColumn(this.column);
      this.isEditingTitle = false;
    } else {
      this.clearColumnEdit();
    }
  }

  clearColumnEdit() {
    this.column.title = this.columnTitle;
    this.isEditingTitle = false;
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

  addCardOnEnter(event: KeyboardEvent) {
    const newCardInput = this.newCardInput.nativeElement;
    newCardInput.style.overflow = "hidden";
    newCardInput.style.height = "0px";
    newCardInput.style.height = newCardInput.scrollHeight + "px";

    if (event.keyCode === 13) {
      if (this.newCardText && this.newCardText.trim() !== "") {
        this.addCard();
        this.newCardText = "";
      } else {
        this.clearCardAdd();
      }
    } else if (event.keyCode === 27) {
      this.clearCardAdd();
    }
  }

  addCardOnBlur() {
    if (this.isAddingCard) {
      if (this.newCardText && this.newCardText.trim() !== "") {
        this.addCard();
      }
    }
    this.clearCardAdd();
  }

  addCard() {
    this.cards$.pipe(tap((cards) => (this.columnLength = cards.length)));
    const newCard: Card = {
      id: uuidv4(),
      text: this.newCardText,
      order: this.columnLength,
    };
    this.cardService.addCard(newCard, this.column.id);
  }

  clearCardAdd() {
    this.isAddingCard = false;
    this.newCardText = "";
  }

  updateCard(card: Card) {
    this.cardService.updateCard(card, this.column.id);
  }

  deleteCard(card: Card) {
    this.cardService.deleteCard(card, this.column.id);
  }
}
