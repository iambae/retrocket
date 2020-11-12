import { Injectable } from "@angular/core";
import { map as rxMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { Board } from "../models/index";

// TODO: Replace with AuthService?
@Injectable()
export class BoardService {
  constructor(private firestoreService: AngularFirestore) {}

  createBoard() {}

  /** GET: get all boards associated with this user */
  getBoards(uid: string): Observable<Board[]> {
    return;
  }

  getBoard(boardId: string): Observable<Board> {
    return;
  }
}
