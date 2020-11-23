export interface Board {
  id: string;
  name?: string;
  userId: string;
  colorId: string;
  // admin: string;
  // createdAt: Date;
  // updatedAt: Date;
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
  // author: string;
  // votes: number;
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
