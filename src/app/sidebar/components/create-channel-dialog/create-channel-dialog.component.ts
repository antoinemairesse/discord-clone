import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChannelService, ChannelType} from "../../../services/channel.service";

@Component({
  selector: 'app-create-channel-dialog',
  templateUrl: './create-channel-dialog.component.html',
  styleUrls: ['./create-channel-dialog.component.scss']
})
export class CreateChannelDialogComponent implements OnInit {
  channelForm = new FormGroup({
    type: new FormControl('text', Validators.required),
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  })

  constructor(
    private dialogRef: MatDialogRef<CreateChannelDialogComponent>,
    private channelService: ChannelService,
    @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  get type() {
    return this.channelForm.get('type');
  }

  get name() {
    return this.channelForm.get('name');
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close()
  }

  createChannel(): void {
    let type = ChannelType.Text;
    if (this.type?.value == 'audio') {
      type = ChannelType.Audio;
    }
    if (this.channelForm.valid) {
      this.channelService.createChannel(this.data, this.name?.value.replaceAll(' ', '-').toLowerCase(), type)
      this.close()
    }
  }

}
