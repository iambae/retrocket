export interface Board {
  id: string;
  name?: string;
  author: string;
  memo?: string;
  color?: string;
  created: any;
  columns: {
    0: string;
    1: string;
    2: string;
    3: string;
  };
}

export interface Column {
  name: string;
  order: number;
  icon: string;
  color: string;
}

export interface Card {
  id: string;
  colId: number;
  boardId: string;
  text: string;
  order: number;
}

export interface Color {
  value: string;
  name: string;
  label: string;
  text: "white" | "black";
  order: number;
}

export interface Team {
  boardId: string;
  members: string[];
}
