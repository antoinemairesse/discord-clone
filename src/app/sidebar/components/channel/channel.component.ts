import {Component, Input, OnInit} from '@angular/core';
import {ChannelType} from 'src/app/services/channel.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})

export class ChannelComponent implements OnInit {
  channelTypes = ChannelType;
  @Input() ChannelName: string = '';
  @Input() ChannelType: ChannelType = ChannelType.Text;

  constructor() {
  }

  ngOnInit(): void {
  }

}
