import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Channel, ChannelService, ChannelType} from "../services/channel.service";
import {ServerService} from "../services/server.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {CreateChannelDialogComponent} from "./components/create-channel-dialog/create-channel-dialog.component";
import {ModifyChannelDialogComponent} from "./components/modify-channel-dialog/modify-channel-dialog.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import { defaultPhotoURL } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  defaultPhotoURL: string = '';
  photoURL: string = '';
  displayName: string = '';
  channels: Channel[] = [];
  channelTypes = ChannelType;
  selectedChannelUID: number = -1;
  currentServerUID: string = '';
  notifier: Subject<any> = new Subject<any>();

  constructor(private authService: AuthService, private channelService: ChannelService, private serverService: ServerService, private dialog: MatDialog) {
    this.channelService.init();
    this.defaultPhotoURL = defaultPhotoURL;
  }

  ngOnInit(): void {
    this.authService.authState.pipe(takeUntil(this.notifier)).subscribe((user: any) => {
      if (user) {
        this.photoURL = user.photoURL;
        this.displayName = user.displayName;
      }
    })

    this.serverService.selectedServer.pipe(takeUntil(this.notifier)).subscribe((server: any) => {
      if (server) {
        this.currentServerUID = server.doc.uid;
      }
    })

    this.channelService.channels.pipe(takeUntil(this.notifier)).subscribe((channels) => {
      this.channels = channels;
    })

    window.addEventListener("click", () => {
      let el = document.getElementById("context-menu-channel")
      if (el) {
        el.classList.remove("active");
      }
    })
  }

  select(index: number) {
    this.channelService.selectChannel(index)
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.channels, event.previousIndex, event.currentIndex);
  }

  ngOnDestroy(): void {
    this.channelService.destroy()
    this.notifier.next()
    this.notifier.complete()
  }

  modifyChannel() {
    this.dialog.open(ModifyChannelDialogComponent, {
      width: '450px',
      data: this.selectedChannelUID
    })
  }

  createChannel() {
    if (this.currentServerUID != '') {
      this.dialog.open(CreateChannelDialogComponent, {
        width: '450px',
        data: this.currentServerUID
      })
    }
  }

  signOut() {
    this.authService.signOut();
  }

  deleteChannel() {
    this.channelService.deleteChannel(this.selectedChannelUID);
  }

  onRightClick(event: MouseEvent, channel_uid: number) {
    event.preventDefault()
    this.selectedChannelUID = channel_uid;
    let el = document.getElementById("context-menu-channel")
    let t = document.getElementById("context-menu-server")
    if (t) {
      t.classList.remove("active");
    }
    if (el) {
      el.style.top = event.pageY + "px";
      el.style.left = event.pageX + "px";
      el.classList.add("active");
    }
  }
}
