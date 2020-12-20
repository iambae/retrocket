import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

interface DialogData {
  function: "Share" | "Create" | "Delete";
  title: string;
  copyUrl?: string;
  name?: string;
  memo?: string;
}

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
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

	// For function === "Create"
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      memo: [data.memo],
    });
  }

   /**
	 * Function: "Create"
	 */
  save() {
    this.dialogRef.close(this.form.value);
  }

   /**
	 * Function: "Delete"
	 */
  confirm(res: string) {
    this.dialogRef.close(res);
  }

    /**
	 * Function: "Share"
	 */
	copy() {
		// Get input field with url to copy
		let copyText = document.getElementById("copy-before") as HTMLInputElement;
		copyText.select();
		copyText.setSelectionRange(0, 99999);
	
		// Drag and copy url
		document.execCommand("copy");
		let tooltip = document.getElementById("copy-after");
		tooltip.innerHTML = "Copied!";
	  }

  onMouseOut() {
    let tooltip = document.getElementById("copy-after");
    tooltip.innerHTML = "Copy to clipboard";
  }
}
