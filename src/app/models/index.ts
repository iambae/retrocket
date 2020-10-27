export interface Board {
  id: string;
  columnIds: string[];
  name?: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  order: number;
  icon: string;
  color: string;
  cards: Card[];
}

// TODO: include author, authorUid, image, votes
export interface Card {
  id: string;
  text: string;
  order: number;
}
