import { CardService } from "./../../services/card.service";
import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";
import { Column } from "../../models/Column";
import { Card } from "../../models/Card";

@Component({
  selector: "app-column-header",
  templateUrl: "./column-header.component.html",
})
export class ColumnHeaderComponent implements OnInit {
  @Input() column: Column;

  public columnLength: number;
  public cards$: Observable<Card[]>;
  public cardsCount$: Observable<number>;

  constructor(private cardService: CardService) {}

  ngOnInit() {
    this.cards$ = this.cardService.getCards(this.column.id);
    this.cardsCount$ = this.cards$.pipe(rxMap((cards) => cards.length));
  }
}
