import { Injectable } from "@angular/core";
import { map as rxMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from "firebase/app";
import { Team } from "../models/index";

@Injectable({
  providedIn: "root",
})
export class TeamService {
  teams$: Observable<Team[]>;

  constructor(private firestoreService: AngularFirestore) {
    this.teams$ = this.firestoreService
      .collection("teams")
      .snapshotChanges()
      .pipe(
        rxMap((changes) =>
          changes.map((change) => change.payload.doc.data() as Team)
        )
      );
  }

  getTeam(boardId: string): Observable<Team> {
    return this.teams$.pipe(
      rxMap((teams: Team[]) =>
        teams.find((team: Team) => team.boardId === boardId)
      )
    );
  }

  async updateTeam(boardId: string, { type, member }) {
    try {
      await this.firestoreService.doc(`teams/${boardId}`).update(
        type === "add"
          ? {
              members: firebase.firestore.FieldValue.arrayUnion(member),
            }
          : type === "remove"
          ? {
              members: firebase.firestore.FieldValue.arrayRemove(member),
            }
          : {
              members: [],
            }
      );
      console.log(`Team updated!`);
      return true;
    } catch (error) {
      console.error("Error updating board team: ", error);
      return false;
    }
  }

  /* Team ID is made the same as the ID of its corresponding Board to facilitate query  */
  createTeam(boardId: string) {
    this.firestoreService
      .collection<Team[]>("teams")
      .doc<Team>(boardId)
      .ref.set({
        boardId,
        members: "",
      })
      .then(() => console.log(`Team for ${boardId} successfully initialized!`))
      .catch((error) => console.error("Error creating team: ", error));
  }
}
