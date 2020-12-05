import { Component, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

interface DialogData {
  title: string;
  memo?: string;
  name?: string;
}

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent {
  url: string;
  form: FormGroup;
  title: string;
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

    this.title = data.title;
    this.url = window.location.href;
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  copyUrl() {
    /* Get the text field */
    let copyText = document.getElementById("myInput") as HTMLInputElement;

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    let tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied: " + copyText.value;
  }

  outFunc() {
    let tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
  }
}
