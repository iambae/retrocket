import { Card } from "./Card";

export class Column {
  id: string;
  title: string;
  order: number;
  icon: string;
  color: string;
  cards: Card[];
}
