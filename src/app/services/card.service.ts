import { Injectable } from "@angular/core";
import { map as rxMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { Card } from "../models/index";

@Injectable()
export class CardService {
  constructor(private firestoreService: AngularFirestore) {}

  /** GET: get cards in board with boardId */
  getCards(boardId: string): Observable<Card[]> {
    return this.firestoreService
      .collection(`boards/${boardId}/cards`)
      .snapshotChanges()
      .pipe(
        rxMap((changes) =>
          changes.map((change) => {
            const data = change.payload.doc.data() as Card;
            data.id = change.payload.doc.id;
            return data;
          })
        )
      );
  }

  /** POST: add a new card to board with boardId */
  addCard(card: Card, boardId: string) {
    const cardDoc = this.firestoreService
      .collection<Card[]>(`boards/${boardId}/cards`)
      .doc<Card>().ref;

    const id = cardDoc.id;

    cardDoc
      .set({
        ...card,
        boardId,
        id,
      })
      .then(() =>
        console.log(`Card ${card.id} successfully added to board ${boardId}!`)
      )
      .catch((error) => console.error("Error creating card: ", error));
  }

  /** PUT: update card's content in board with boardId */
  updateCard(card: Card, boardId: string) {
    this.firestoreService
      .doc(`boards/${boardId}/cards/${card.id}`)
      .update({
        text: card.text,
        ...card,
      })
      .then(() => console.log(`Card ${card.id} updated!`))
      .catch((error) => console.error("Error updating card: ", error));
  }

  /** DELETE: delete card from board with boardId */
  deleteCard(card: Card, boardId: string) {
    this.firestoreService
      .collection("boards")
      .doc(boardId)
      .collection("cards")
      .doc(card.id)
      .delete()
      .then(() => console.log(`Card ${card.id} successfully deleted!`))
      .catch((error) => console.error("Error deleting card: ", error));
  }
}
