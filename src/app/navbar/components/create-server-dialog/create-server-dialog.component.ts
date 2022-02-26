import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ServerService} from "../../../services/server.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Image, ImageService} from "../../../services/image.service";

@Component({
  selector: 'app-create-server-dialog',
  templateUrl: './create-server-dialog.component.html',
  styleUrls: ['./create-server-dialog.component.scss']
})
export class CreateServerDialogComponent implements OnInit {
  image: Image = {url: '', data: {}};
  serverForm = new FormGroup({
    icon: new FormControl(''),
    name: new FormControl(this.data, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  })

  constructor(private dialogRef: MatDialogRef<CreateServerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string,
              private serverService: ServerService, private imageService: ImageService) {
  }

  get name() {
    return this.serverForm.get('name');
  }

  ngOnInit(): void {
  }

  preview(files: FileList | null): void {
    this.image = this.imageService.readImage(files);
  }

  createServer(): void {
    if (this.serverForm.valid) {
      this.serverService.createServer(this.name?.value, this.image.data)
      this.close()
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
