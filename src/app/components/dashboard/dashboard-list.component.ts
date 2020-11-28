import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { AuthService } from "src/app/auth/auth.service";
import { BoardService } from "src/app/services/board.service";
import { Board } from "src/app/models";

export interface DialogData {
  memo: string;
  name: string;
}

@Component({
  selector: "app-dashboard-list",
  templateUrl: "./dashboard-list.component.html",
  styles: [
    `
      .btn {
        border-radius: 20px;
      }

      table {
        table-layout: fixed;
        width: 100%;
        white-space: nowrap;
      }

      .table-responsive {
        overflow-y: visible;
        overflow-x: visible;
      }
    `,
  ],
})
export class DashboardListComponent implements OnInit, OnDestroy {
  userId: string;
  boards: Board[];
  boardSubscription: Subscription;

  constructor(
    private boardService: BoardService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.boardSubscription = this.authService.user
      .pipe(
        switchMap((user) => {
          this.userId = user.uid;
          return this.boardService.getBoards(this.userId);
        })
      )
      .subscribe((boards) => (this.boards = boards));
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: "300px",
        data: { name: "", memo: "" },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.addBoard(result);
      });
  }

  addBoard({ name, memo }) {
    const board = {
      id: uuidv4(),
      author: this.userId,
      name,
      memo,
      color: "#fb6340", // default color: Orange
    };
    this.boardService.addBoard(board);
  }

  ngOnDestroy() {
    this.boardSubscription.unsubscribe();
  }
}

@Component({
  selector: "app-dialog",
  template: `
    <h2>Create New Session</h2>
    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="none">
        <input
          matInput
          class="form-control"
          placeholder="Name"
          formControlName="name"
        />
      </mat-form-field>
      <mat-form-field appearance="none">
        <textarea
          matInput
          class="form-control"
          placeholder="Memo"
          formControlName="memo"
        ></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button [disabled]="!form.valid" class="btn" (click)="save()">
        <i class="fas fa-check fa-lg"></i>
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .form-control {
        border-radius: 10px;
        border-style: dashed;
        border-width: medium;
        border-color: rgba(223, 222, 222, 0.9);
        background-color: rgba(223, 222, 222, 0.3);
        color: black;
        padding: 10px;
      }

      .mat-dialog-actions {
        text-align: center;
      }

      button:hover {
        box-shadow: none;
        transition: none;
      }

      button {
        margin: auto;
      }
    `,
  ],
})
export class DialogComponent {
  form: FormGroup;
  dialogData: DialogData;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogData = data;

    this.form = this.fb.group({
      name: [data.name, Validators.required],
      memo: [data.memo],
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }
}
