import { Injectable } from "@angular/core";
import { filter, map as rxMap } from "rxjs/operators";
import { Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Board } from "../models/index";

@Injectable()
export class BoardService {
  public board: Board;
  public boards: Board[];
  boards$: Observable<Board[]>;
  boardCollection: AngularFirestoreCollection<Board>;

  constructor(private firestoreService: AngularFirestore) {
    this.boardCollection = this.firestoreService.collection("boards");
    this.boards$ = this.boardCollection.snapshotChanges().pipe(
      rxMap((changes) =>
        changes.map((change) => {
          const data = change.payload.doc.data() as Board;
          data.id = change.payload.doc.id;
          return data;
        })
      )
    );
  }

  createBoard() {}

  getBoard(boardId: string): Observable<Board> {
    return this.boards$.pipe(
      filter((boards) => !!boards),
      rxMap((boards) => {
        this.board = boards.find((board) => board.id === boardId);
        return this.board;
      })
    );
  }

  /** GET: get all boards associated with user with userId */
  getBoards(userId: string): Observable<Board[]> {
    return this.boards$.pipe(
      rxMap((boards) => {
        this.boards = boards.filter((board) => board.userId === userId);
        return this.boards;
      })
    );
  }

  updateBoard(boardId: string, data: any) {
    this.firestoreService
      .doc(`boards/${boardId}`)
      .update(data)
      .then(() => console.log(`Board ${boardId} updated!`))
      .catch((error) => console.error("Error updating card: ", error));
  }
}
