import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {arrayUnion, serverTimestamp, Timestamp} from "@angular/fire/firestore";

import {BehaviorSubject, Observable, Subject} from "rxjs";
import {ChannelService} from "./channel.service";
import {first} from "rxjs/operators";
import {ServerService} from "./server.service";

export enum MessageType {
  Text,
  Image
}

export interface Message {
  photoURL: string,
  displayName: string,
  content: string,
  date: Timestamp,
  type: MessageType
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  sender: string = '';
  messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  notifier: Subject<any> = new Subject<any>();

  constructor(private afs: AngularFirestore, private authService: AuthService, private channelService: ChannelService, private serverService: ServerService) {
  }

  init(): void {
    this.notifier = new Subject<any>();
    this.authService.authState.subscribe(user => {
      if (user) {
        this.sender = user.uid;
      }
    })
    this.channelService.selectedChannel.pipe(this.getMessageAndSenderDataFromRef())
      .subscribe((next: any) => {
        this.messages.next(this.buildMessageArray(next));
      })
  }


  destroy(): void {
    this.messages.next([]);
    this.notifier.next()
    this.notifier.complete()
  }

  getType(type: string) {
    if (type == 'text') {
      return MessageType.Text
    } else {
      return MessageType.Image
    }
  }

  buildMessageArray(data: any): Message[] {
    let messages: Message[] = [];
    data.messages.forEach((msg: any) => {
      messages.push({
        photoURL: msg.sender.photoURL,
        displayName: msg.sender.displayName,
        content: msg.content,
        date: msg.date,
        type: this.getType(msg.type)
      })
    })
    return messages;
  }

  getMessageAndSenderDataFromRef = () => (source: Observable<any>) => new Observable(observer => {
    let state: boolean = false;
    return source.pipe().subscribe((next: any) => {
      if (next && !state) {
        state = true;
        let y: number = 0;
        new Promise(resolve => {
          if (next.messages.length <= 0) {
            resolve(false);
          } else {
            this.serverService.selectedServerMembers.pipe(first(res => {
              return res.length > 0
            })).subscribe((res: any) => {
              next.messages.forEach((message: any, i: number) => {
                message.get().then((msg: any) => {
                  next.messages[i] = msg.data()
                  next.messages[i].sender = res.find((el: any) => el.uid == msg.data().sender);
                  y++;
                  if (y == next?.messages.length) resolve(true);
                });
              })
            })
          }
        })
          .then(() => {
            observer.next(next);
            state = false;
          })
      }
    })
  });

  sendTextMessage(uid: string, content: string) {
    if (this.sender == '') {
      return
    }
    let doc = this.afs.doc(`messages/${this.afs.createId()}`);
    doc.set({
      sender: this.sender,
      content: content,
      type: "text",
      date: serverTimestamp()
    });
    this.afs.doc(`channels/${uid}`).update({
      messages: arrayUnion(doc.ref)
    })
  }

}
