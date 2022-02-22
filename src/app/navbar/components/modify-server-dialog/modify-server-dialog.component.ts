import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ServerService} from "../../../services/server.service";

@Component({
  selector: 'app-modify-server-dialog',
  templateUrl: './modify-server-dialog.component.html',
  styleUrls: ['./modify-server-dialog.component.scss']
})
export class ModifyServerDialogComponent implements OnInit {
  imgURL: any = null;
  imgData: any = null;
  serverForm = new FormGroup({
    icon: new FormControl(''),
    name: new FormControl(this.data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  })

  constructor(private dialogRef: MatDialogRef<ModifyServerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private serverService: ServerService) {
    this.imgURL = this.data.imgURL;
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

  close(): void {
    this.dialogRef.close();
  }

  modifyServer() {
    if (this.serverForm.valid && this.data.uid != null) {
      if (this.imgData != null) {
        this.serverService.modifyServer(this.data.uid, this.name?.value, this.imgData)
      } else {
        this.serverService.modifyServer(this.data.uid, this.name?.value)
      }
      this.close()
    }
  }
}
