import { Injectable } from "@angular/core";
import { map as rxMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { Board } from "../models/index";
import firebase from "firebase/app";

@Injectable({
  providedIn: "root",
})
export class BoardService {
  boards$: Observable<Board[]>;

  constructor(private firestoreService: AngularFirestore) {
    this.boards$ = this.firestoreService
      .collection("boards")
      .snapshotChanges()
      .pipe(
        rxMap((changes) =>
          changes
            .map((change) => {
              const data = change.payload.doc.data() as Board;
              data.id = change.payload.doc.id;
              return data;
            })
            .sort((a, b) => a.created - b.created)
        )
      );
  }

     /** GET: get board with boardId from firestore */
  getBoard(boardId: string): Observable<Board> {
    return this.boards$.pipe(
      rxMap((boards) => boards.find((board) => board.id === boardId))
    );
  }

     /** GET: get board hosted by user with userId from firestore */
  getBoards(userId: string): Observable<Board[]> {
    return this.boards$.pipe(
      rxMap((boards) => {
        return boards.filter((board) => board.author === userId);
      })
    );
  }

     /** ADD: add new board document to board collection */
  addBoard(board: any): string {
    const boardDoc = this.firestoreService
      .collection<Board[]>("boards")
      .doc<Board>().ref;

    const id = boardDoc.id;

    boardDoc
      .set({
        ...board,
        id,
        created: firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => console.log(`New board <${board.name}> created!`))
      .catch((error) => console.error("Error creating new board: ", error));

    return id;
  }

     /** UPDATE: update board with boardId in firestore */
  updateBoard(boardId: string, data: any) {
    this.firestoreService
      .doc(`boards/${boardId}`)
      .update({
        ...data,
      })
      .then(() => console.log(`Board ${boardId} updated!`))
      .catch((error) => console.error("Error updating board: ", error));
  }

   /** DELETE: delete board with boardId from firestore */
  deleteBoard(boardId: string) {
    this.firestoreService
      .collection("boards")
      .doc(boardId)
      .delete()
      .then(() => console.log("Document successfully deleted!"))
      .catch((error) => console.error("Error removing document: ", error));
  }
}
