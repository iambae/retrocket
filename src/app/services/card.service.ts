import { Injectable } from "@angular/core";
import { map as rxMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFirestore } from "angularfire2/firestore";
import { Card } from "../models/index";

@Injectable()
export class CardService {
  constructor(private firestoreService: AngularFirestore) {}

  /** GET: get cards under column with columnId */
  getCards(columnId: string): Observable<Card[]> {
    return this.firestoreService
      .collection("columns")
      .doc(columnId)
      .collection("cards", (collectionRef) =>
        collectionRef.orderBy("order", "asc")
      )
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

  /** POST: add a new card under column with columnId */
  addCard(card: Card, columnId: string) {
    this.firestoreService
      .collection("columns")
      .doc(columnId)
      .collection("cards")
      .doc(card.id)
      .set(card)
      .then(() => console.log(`Card ${card.id} successfully added!`))
      .catch((error) => console.error("Error creating card: ", error));
  }

  /** PUT: update card's content */
  updateCard(card: Card, columnId: string) {
    this.firestoreService
      .doc(`columns/${columnId}/cards/${card.id}`)
      .update({
        text: card.text,
        ...card,
      })
      .then(() => console.log(`Card ${card.id} updated!`))
      .catch((error) => console.error("Error updating card: ", error));
  }

  /** DELETE: delete card from card with columnId */
  deleteCard(card: Card, columnId: string) {
    this.firestoreService
      .collection("columns")
      .doc(columnId)
      .collection("cards")
      .doc(card.id)
      .delete()
      .then(() => console.log(`Card ${card.id} successfully deleted!`))
      .catch((error) => console.error("Error deleting card: ", error));
  }
}
