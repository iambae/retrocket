import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";
import { Column } from "../models/index";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";

@Injectable()
export class ColumnService {
  columnCollection: AngularFirestoreCollection<Column>;
  columnDoc: AngularFirestoreDocument<Column>;
  columns$: Observable<Column[]>;

  constructor(private firestoreService: AngularFirestore) {
    this.columnCollection = this.firestoreService.collection(
      "columns",
      (collectionRef) => collectionRef.orderBy("order", "asc")
    );
  }

  /** GET column configurations */
  getColumns(): Observable<Column[]> {
    this.columns$ = this.columnCollection.snapshotChanges().pipe(
      rxMap((changes) =>
        changes.map((change) => {
          const data = change.payload.doc.data() as Column;
          data.id = change.payload.doc.id;
          return data;
        })
      )
    );

    return this.columns$;
  }

  /** PUT: update the column title */
  updateColumn(column: Column) {
    this.columnDoc = this.firestoreService.doc(`columns/${column.id}`);
    this.columnDoc
      .update({
        title: column.title,
        ...column,
      })
      .then(() => console.log(`Column ${column.title} successfully updated!`))
      .catch((error) => console.error("Error updating column: ", error));
  }
}
