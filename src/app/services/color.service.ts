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
    return this.colorCollection
      .snapshotChanges()
      .pipe(
        rxMap((changes) =>
          changes.map((change) => change.payload.doc.data() as Color)
        )
      );
  }

  /** GET data for color with colorValue from the server */
  getColor(colorValue: string): Observable<Color> {
    return this.getColors().pipe(
      rxMap((colors) => {
        return colors.find((color) => color.value === colorValue);
      })
    );
  }
}
