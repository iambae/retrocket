import { Injectable } from "@angular/core";
import { map as rxMap, switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { Board } from "../models/index";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";

@Injectable()
export class BoardService {
  boards$: Observable<Board[]>;

  constructor(
    private firestoreService: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.boards$ = this.afAuth.user.pipe(
      switchMap((user) =>
        this.firestoreService
          .collection("boards", (collectionRef) =>
            collectionRef.where("author", "==", user.uid)
          )
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
          )
      )
    );
  }

  getBoard(boardId: string): Observable<Board> {
    return this.boards$.pipe(
      rxMap((boards) => boards.find((board) => board.id === boardId))
    );
  }

  getBoards(userId: string): Observable<Board[]> {
    return this.boards$.pipe(
      rxMap((boards) => {
        return boards.filter((board) => board.author === userId);
      })
    );
  }

  addBoard(board) {
    this.firestoreService
      .collection("boards")
      .doc(board.id)
      .set({
        ...board,
        created: firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => console.log(`New board <${board.name}> created!`))
      .catch((error) => console.error("Error creating new board: ", error));
  }

  updateBoard(boardId: string, data: any) {
    this.firestoreService
      .doc(`boards/${boardId}`)
      .update({
        ...data,
      })
      .then(() => console.log(`Board ${boardId} updated!`))
      .catch((error) => console.error("Error updating board: ", error));
  }

  deleteBoard(boardId: string) {
    this.firestoreService
      .collection("boards")
      .doc(boardId)
      .delete()
      .then(() => console.log("Document successfully deleted!"))
      .catch((error) => console.error("Error removing document: ", error));
  }
}
