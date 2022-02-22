import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {arrayUnion, serverTimestamp, Timestamp,} from "@angular/fire/firestore";

import {BehaviorSubject} from "rxjs";
import {ChannelService} from "./channel.service";

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

  constructor(private afs: AngularFirestore, private authService: AuthService, private channelService: ChannelService) {
    this.authService.authState.subscribe(user => {
      if (user) {
        this.sender = user.uid;
      }
    })

    this.channelService.selectedChannel.subscribe( next => {
      if (next) {
        let messages: Message[] = [];
        let index: number = 0;
        new Promise<Message[]>((resolve) => {
          if (next.messages.length < 1) {
            resolve([])
          }
          next.messages.forEach((message: any, i: number, array: any[]) => {
            message.get().then((msg: any) => {
              if (!msg.data()) {
                resolve([]);
                return;
              }
              msg.data().sender.get().then((sender: any) => {
                messages[index] = {
                  photoURL: sender.data().photoURL,
                  displayName: sender.data().displayName,
                  content: msg.data().content,
                  date: msg.data().date,
                  type: this.getType(msg.data().type)
                }
                index++;
                if (index === array.length) resolve(messages);
              })
            })
          })
        }).then((messages: Message[]) => {
          this.messages.next(messages);
        })
      } else {
        this.messages.next([]);
      }
    })
  }

  destroy(): void{
    this.messages.next([]);
  }

  getType(type: string) {
    if (type == 'text') {
      return MessageType.Text
    } else {
      return MessageType.Image
    }
  }

  sendTextMessage(uid: string, content: string) {
    if (this.sender == '') {
      return
    }
    let doc = this.afs.doc(`messages/${this.afs.createId()}`);
    doc.set({
      sender: this.afs.collection('users').doc(this.sender).ref,
      content: content,
      type: "text",
      date: serverTimestamp()
    });
    this.afs.doc(`channels/${uid}`).update({
      messages: arrayUnion(doc.ref)
    })
  }

}
