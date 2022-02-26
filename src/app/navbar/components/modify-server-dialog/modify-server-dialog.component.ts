import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ServerService} from "../../../services/server.service";
import {Image, ImageService} from "../../../services/image.service";

@Component({
  selector: 'app-modify-server-dialog',
  templateUrl: './modify-server-dialog.component.html',
  styleUrls: ['./modify-server-dialog.component.scss']
})
export class ModifyServerDialogComponent implements OnInit {
  image: Image = {url: '', data: {}};
  serverForm = new FormGroup({
    icon: new FormControl(''),
    name: new FormControl(this.data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  })

  constructor(private dialogRef: MatDialogRef<ModifyServerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private serverService: ServerService, private imageService: ImageService) {
    this.image.url = this.data.imgURL;
  }

  get name() {
    return this.serverForm.get('name');
  }

  ngOnInit(): void {
  }

  preview(files: FileList | null): void {
    this.image = this.imageService.readImage(files);
  }

  close(): void {
    this.dialogRef.close();
  }

  modifyServer() {
    if (this.serverForm.valid && this.data.uid != null) {
      if (this.image.data != null) {
        this.serverService.modifyServer(this.data.uid, this.name?.value, this.image.data)
      } else {
        this.serverService.modifyServer(this.data.uid, this.name?.value)
      }
      this.close()
    }
  }
}
