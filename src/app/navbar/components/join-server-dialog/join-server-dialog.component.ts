import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ServerService} from "../../../services/server.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-join-server-dialog',
  templateUrl: './join-server-dialog.component.html',
  styleUrls: ['./join-server-dialog.component.scss']
})
export class JoinServerDialogComponent implements OnInit {
  isCodeValid: boolean = true;
  joinServerForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(20)])
  })
  constructor(private dialogRef: MatDialogRef<JoinServerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string,
              private serverService: ServerService) { }

  ngOnInit(): void {
  }

  get code(){
    return this.joinServerForm.get('code');
  }

  close(): void {
    this.dialogRef.close();
  }

  joinServer(): void {
    if (this.joinServerForm.valid && this.code) {
      let t = this.serverService.joinServer(this.code.value);
      t.then((next) => {
        if(next){
          this.close();
        } else {
          this.isCodeValid = false;
        }
      })
    }
  }

}
