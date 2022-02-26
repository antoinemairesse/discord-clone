import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {arrayRemove, arrayUnion} from "@angular/fire/firestore";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {Server, ServerService} from "./server.service";
import {take, takeUntil} from "rxjs/operators";

export enum ChannelType {
  Text,
  Audio
}

export interface Channel {
  uid: number,
  type: ChannelType,
  name: string,
  index: number,
  messages: any[],
}

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  selectedChannel: BehaviorSubject<Channel | undefined> = new BehaviorSubject<Channel | undefined>(undefined);
  selectedChannelIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  channels: BehaviorSubject<Channel[]> = new BehaviorSubject<Channel[]>([]);
  notifier: Subject<any> = new Subject<any>();
  server: Server | undefined;

  constructor(private afs: AngularFirestore, private authService: AuthService, private serverService: ServerService) {
  }

  init(): void {
    this.notifier = new Subject<any>();
    this.serverService.selectedServer.pipe(takeUntil(this.notifier)).subscribe((server: any) => {
      if (server) {
        this.server = server;
        this.addChannels(server.doc)
      }
    })

    this.afs.collection('channels').valueChanges().pipe(takeUntil(this.notifier)).subscribe(() => {
      if(this.server){
        this.addChannels(this.server.doc)
      }
    })
  }

  destroy(): void {
    this.selectedChannel.next(undefined)
    this.selectedChannelIndex.next(0);
    this.channels.next([])
    this.notifier.next()
    this.notifier.complete()
    this.server = undefined;
  }

  addChannels(server: any) {
    let channels: any[] = [];
    let i: number = -1;
    if (server) {
      new Promise((resolve) => {
        let count = 0;
        server.channels.forEach(async (channel: any, index: number) => {
          await new Promise((resolve) => {
            channel.get().then((next: any) => {
              if (next.data()) {
                if (index > channels.length) {
                  channels.push({
                    uid: next.data().uid,
                    type: next.data().type,
                    name: next.data().name,
                    index: channels.length,
                    messages: next.data().messages
                  })
                } else {
                  channels[index] = {
                    uid: next.data().uid,
                    type: next.data().type,
                    name: next.data().name,
                    index: channels.length,
                    messages: next.data().messages
                  }
                }
                resolve(1)
              } else {
                resolve(0)
              }
            })
          }).then((res: any) => {
            count += res;
          })
          i++;
          if (count == server.channels.length) {
            resolve(true)
          }
        })
        if (server.channels.length == 0) {
          resolve(true);
        }
      }).then(() => {
        if (channels.length > i) {
          for (let x = i; i < channels.length - 1; x++) {
            channels.pop()
          }
        }
        this.channels.next(channels);
        this.selectedChannelIndex.pipe(take(1)).subscribe((next) => {
          this.selectedChannel.next(channels[next]);
        })
      })
    }

  }

  selectChannel(index: number) {
    let sub = this.channels.subscribe((channels: any) => {
      this.selectedChannel.next(channels[index])
    })
    this.selectedChannelIndex.next(index);
    sub.unsubscribe();
  }

  modifyChannel(channel: string, name: string) {
    let doc = this.afs.doc(`channels/${channel}`);
    doc.update({
      name: name
    })
  }

  createChannel(server: string, name: string, type: ChannelType) {
    let uid = this.afs.createId();
    let doc = this.afs.doc(`channels/${uid}`);
    doc.set({
      uid: uid,
      name: name,
      type: type,
      messages: []
    });
    this.afs.doc(`servers/${server}`).update({
      channels: arrayUnion(doc.ref)
    })
  }

  deleteChannel(uid: number) {
    let channel = this.afs.doc(`channels/${uid}`).ref;
    let sub = this.afs.collection('servers',
      ref => ref.where('channels', "array-contains", channel)).get().subscribe((next: any) => {
      next.docs[0].ref.update({
        channels: arrayRemove(channel)
      }).then(() => {
        this.afs.doc(`channels/${uid}`).delete();
        sub.unsubscribe()
      })
    })
  }

  updateChannel() {

  }

}
