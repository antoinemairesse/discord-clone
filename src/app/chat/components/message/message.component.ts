import {Component, Input, OnInit} from '@angular/core';
import {Timestamp} from "@angular/fire/firestore";
import {ServerService} from "../../../services/server.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() photoURL: string = '';
  @Input() displayName: string = '';
  @Input() date: Timestamp = Timestamp.now();
  defaultPhotoURL: string = '';

  constructor(private serverService: ServerService) {
    this.defaultPhotoURL = serverService.defaultPhotoURL;
  }

  ngOnInit(): void {
  }

}
