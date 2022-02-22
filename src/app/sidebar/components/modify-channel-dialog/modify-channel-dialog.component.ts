import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChannelService} from "../../../services/channel.service";

@Component({
  selector: 'app-modify-channel-dialog',
  templateUrl: './modify-channel-dialog.component.html',
  styleUrls: ['./modify-channel-dialog.component.scss']
})
export class ModifyChannelDialogComponent implements OnInit {
  channelForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  })

  constructor(private dialogRef: MatDialogRef<ModifyChannelDialogComponent>,
              private channelService: ChannelService,
              @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  get name() {
    return this.channelForm.get('name');
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close()
  }

  modifyChannel() {
    if (this.channelForm.valid) {
      this.channelService.modifyChannel(this.data, this.name?.value.replaceAll(' ', '-').toLowerCase())
      this.close()
    }
  }


}
