export interface Board {
  id: string;
  name?: string;
  userId: string;
  memo?: string;
  color?: string;
  created: any;
  modified: any;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  icon: string;
  color: string;
}

export interface Card {
  id: string;
  colId: string;
  boardId: string;
  text: string;
  order: number;
}

export interface Color {
  id: string;
  value: string;
  name: string;
  label: string;
  text: "white" | "black";
  order: number;
}

export interface Route {
  path: string;
  title: string;
  icon: string;
  class: string;
}
