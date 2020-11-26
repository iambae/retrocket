import { Injectable } from "@angular/core";
import { filter, map as rxMap } from "rxjs/operators";
import { Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Board } from "../models/index";
import { firestore } from "firebase";

@Injectable()
export class BoardService {
  boards$: Observable<Board[]>;
  boardCollection: AngularFirestoreCollection<Board>;

  constructor(private firestoreService: AngularFirestore) {
    this.boardCollection = this.firestoreService.collection(
      "boards",
      (collectionRef) => collectionRef.orderBy("created")
    );
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

  addBoard(board) {
    this.boardCollection
      .doc(board.id)
      .set(board)
      .then(() => console.log(`New board <${board.name}> created!`))
      .catch((error) => console.error("Error creating new board: ", error));
  }

  getBoard(boardId: string): Observable<Board> {
    return this.boards$.pipe(
      filter((boards) => !!boards),
      rxMap((boards) => {
        return boards.find((board) => board.id === boardId);
      })
    );
  }

  getBoards(userId: string): Observable<Board[]> {
    return this.boards$.pipe(
      rxMap((boards) => {
        return boards.filter((board) => board.userId === userId);
      })
    );
  }

  updateBoard(boardId: string, data: any) {
    this.firestoreService
      .doc(`boards/${boardId}`)
      .update({
        modified: firestore.FieldValue.serverTimestamp(),
        ...data,
      })
      .then(() => console.log(`Board ${boardId} updated!`))
      .catch((error) => console.error("Error updating board: ", error));
  }

  deleteBoard(boardId: string) {
    this.boardCollection
      .doc(boardId)
      .delete()
      .then(() => console.log("Document successfully deleted!"))
      .catch((error) => console.error("Error removing document: ", error));
  }
}
