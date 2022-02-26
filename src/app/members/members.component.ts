import { Component, OnInit } from '@angular/core';
import {ServerService} from "../services/server.service";
import {UserCustom} from "../user";
import {filter} from "rxjs/operators";
import { defaultPhotoURL } from 'src/environments/environment';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  members: UserCustom[] = [];
  defaultPhotoURL: string = '';
  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    this.defaultPhotoURL = defaultPhotoURL
    this.serverService.selectedServerMembers.pipe(filter(res => res.length > 0)).subscribe(next => {
      this.members = next;
    })
  }

}
