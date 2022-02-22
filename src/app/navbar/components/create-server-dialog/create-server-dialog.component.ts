import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ServerService} from "../../../services/server.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-server-dialog',
  templateUrl: './create-server-dialog.component.html',
  styleUrls: ['./create-server-dialog.component.scss']
})
export class CreateServerDialogComponent implements OnInit {
  imgURL: any = null;
  imgData: any = null;
  serverForm = new FormGroup({
    icon: new FormControl(''),
    name: new FormControl(this.data, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  })

  constructor(private dialogRef: MatDialogRef<CreateServerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string,
              private serverService: ServerService) {
  }

  get name() {
    return this.serverForm.get('name');
  }

  ngOnInit(): void {
  }

  preview(files: FileList | null): void {
    if (files && files.length > 0) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgData = files[0];
        this.imgURL = reader.result;
      }
    } else {
      this.imgURL = null;
    }
  }

  createServer(): void {
    if (this.serverForm.valid) {
      this.serverService.createServer(this.name?.value, this.imgData)
      this.close()
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
