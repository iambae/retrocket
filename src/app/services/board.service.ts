import { Injectable } from "@angular/core";
import { map as rxMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFirestore } from "angularfire2/firestore";
import { Board } from "../models/index";

@Injectable()
export class BoardService {
  constructor(private firestoreService: AngularFirestore) {}

  /** GET: get all boards associated with this user */
  getBoards(columnId: string): Observable<Board[]> {
    return;
  }
}
