import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";
import { Color } from "../models/index";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";

@Injectable()
export class ColorService {
  colorCollection: AngularFirestoreCollection<Color>;
  colors$: Observable<Color[]>;

  constructor(private firestoreService: AngularFirestore) {
    this.colorCollection = this.firestoreService.collection(
      "colors",
      (collectionRef) => collectionRef.orderBy("order", "asc")
    );
  }

  /** GET all available colors from the server */
  getColors(): Observable<Color[]> {
    this.colors$ = this.colorCollection
      .snapshotChanges()
      .pipe(
        rxMap((changes) =>
          changes.map((change) => change.payload.doc.data() as Color)
        )
      );

    return this.colors$;
  }

  /** GET data for color with colorId from the server */
  getColor(colorId: string): Observable<Color> {
    const colors = this.firestoreService.doc<Color>(`colors/${colorId}`);

    return colors.snapshotChanges().pipe(
      rxMap((changes) => {
        const data = changes.payload.data() as Color;
        const id = changes.payload.id;
        return { id, ...data };
      })
    );
  }
}
