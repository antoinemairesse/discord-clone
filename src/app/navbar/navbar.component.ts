import {Component, OnDestroy, OnInit} from '@angular/core';
import {Server, ServerService} from "../services/server.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {CreateServerDialogComponent} from "./components/create-server-dialog/create-server-dialog.component";
import {AuthService} from "../services/auth.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ModifyServerDialogComponent} from "./components/modify-server-dialog/modify-server-dialog.component";
import {JoinServerDialogComponent} from "./components/join-server-dialog/join-server-dialog.component";
import { defaultPhotoURL } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  defaultPhotoURL: string = '';
  servers: Server[] = [];
  selectedServerIndex: number = 0;
  notifier: Subject<any> = new Subject<any>();
  contextMenuServerUID: number = -1;
  contextMenuServerIndex: number = -1;

  constructor(private serverService: ServerService, public dialog: MatDialog, private authService: AuthService) {
    this.defaultPhotoURL = defaultPhotoURL;
    this.serverService.init();
  }

  ngOnInit(): void {
    this.serverService.servers.pipe(takeUntil(this.notifier)).subscribe((servers: any) => {
      this.servers = servers;
    })

    this.serverService.selectedServerIndex.pipe(takeUntil(this.notifier)).subscribe((selected: any) => {
      this.selectedServerIndex = selected;
    })

    window.addEventListener("click", () => {
      let el = document.getElementById("context-menu-server")
      if (el) {
        el.classList.remove("active");
      }
    })
  }

  select(index: number) {
    this.serverService.selectServer(index);
  }

  modifyServer() {
    this.dialog.open(ModifyServerDialogComponent, {
      width: '450px',
      data: {
        imgURL: this.servers[this.contextMenuServerIndex].photoURL,
        name: this.servers[this.contextMenuServerIndex].name,
        uid: this.contextMenuServerUID
      }
    })
  }

  addServer() {
    new Promise((resolve, reject) => {
      this.authService.authState.subscribe((user: any) => {
        if (user) {
          resolve(user.displayName.split(" ")[0]);
        } else {
          reject()
        }
      })
    }).then(name => {
      this.dialog.open(CreateServerDialogComponent, {
        width: '450px',
        data: 'Serveur de ' + name
      })
    })
  }

  joinServer(){
    this.dialog.open(JoinServerDialogComponent, {
      width: '450px'
    })
  }

  ngOnDestroy(): void {
    this.serverService.destroy();
    this.notifier.next()
    this.notifier.complete()
  }

  onRightClick($event: MouseEvent, uid: number, index: number) {
    $event.preventDefault()
    this.contextMenuServerUID = uid;
    this.contextMenuServerIndex = index;
    let el = document.getElementById("context-menu-server")
    let t = document.getElementById("context-menu-channel")
    if (t) {
      t.classList.remove("active");
    }
    if (el) {
      el.style.top = $event.pageY + "px";
      el.style.left = $event.pageX + "px";
      el.classList.add("active");
    }
  }

  deleteServer() {
    if (this.contextMenuServerUID != -1) {
      this.serverService.deleteServer(this.contextMenuServerUID);
    }
    this.contextMenuServerUID = -1;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.servers, event.previousIndex, event.currentIndex);
  }
}
