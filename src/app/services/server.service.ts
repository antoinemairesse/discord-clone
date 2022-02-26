import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {arrayUnion} from "@angular/fire/firestore";
import {BehaviorSubject, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@angular/fire/storage";
import {UserCustom} from "../user";
import {user} from "@angular/fire/auth";
import {defaultPhotoURL} from "../../environments/environment";

export interface Server {
  doc: any,
  index: number,
  name: string,
  photoURL: string,
  users: UserCustom[]
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  selectedServer: BehaviorSubject<Server | undefined> = new BehaviorSubject<Server | undefined>(undefined);
  selectedServerIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  servers: BehaviorSubject<Server[]> = new BehaviorSubject<Server[]>([]);
  notifier: Subject<any> = new Subject<any>();
  selectedServerMembers: BehaviorSubject<UserCustom[]> = new BehaviorSubject<UserCustom[]>([]);

  constructor(private afs: AngularFirestore, private authService: AuthService, private storage: AngularFireStorage) {
  }

  init(): void {
    this.notifier = new Subject<any>();

    let s = localStorage.getItem('selected-server');
    if (s) {
      this.selectedServerIndex.next(parseInt(s.toString()));
    }

    this.authService.authState.pipe(takeUntil(this.notifier)).subscribe(user => {
      if (user) {
        this.afs.collection(
          'servers',
          ref => ref.where('members', "array-contains", this.authService.userRef)
        ).valueChanges().pipe(takeUntil(this.notifier)).subscribe((next: any) => {
          let servers: Server[] = [];
          next.forEach((server: any) => {
            servers.push({
              doc: server,
              index: servers.length,
              name: server.name,
              photoURL: server.photoURL,
              users: server.members
            })
          })
          this.servers.next(servers);
          let sub = this.selectedServerIndex.subscribe((next: any) => {
            this.getMembers(servers[next])
            this.selectedServer.next(servers[next]);
          })
          sub.unsubscribe()
        })
      }
    })
  }

  //reset subjects for next user.
  destroy(): void {
    this.servers.next([])
    this.selectedServer.next(undefined)
    this.selectedServerIndex.next(0)
    this.selectedServerMembers.next([])
    this.notifier.next()
    this.notifier.complete()
  }

  getMembers(server: any){
    if(!server) return
    let users: UserCustom[] = []
    new Promise(resolve => {
      server.users.forEach((member: any, i: number) => {
        member.get().then((next: any) => {
          users.push({
            uid: next.data().uid,
            email: next.data().email,
            displayName: next.data().displayName,
            photoURL: next.data().photoURL
          })
          if (i+1 == server.users.length) resolve(true);
        })
      })
    }).then(() => {
      this.selectedServerMembers.next(users)
    })
  }

  selectServer(index: number) {
    localStorage.setItem('selected-server', index.toString());
    let sub = this.servers.pipe(takeUntil(this.notifier)).subscribe((servers: any) => {
      this.getMembers(servers[index].users)
      this.selectedServer.next(servers[index]);
    })
    this.selectedServerIndex.next(index);
    sub.unsubscribe()
  }

  joinServer(uid: number): Promise<boolean> {
    let server = this.afs.doc(`servers/${uid}`).ref;
    return new Promise((resolve) => {
      server.get().then(next => {
        if (next.data()) {
          this.authService.authState.subscribe(next => {
            if (next) {
              server.update({
                members: arrayUnion(this.afs.collection('users').doc(next.uid).ref)
              })
            }
          })
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })

  }

  deleteServer(uid: number) {
    let server = this.afs.doc(`servers/${uid}`).ref;
    new Promise((resolve) => {
      server.get().then((next: any) => {
        next.data().channels.forEach((channel: any, index: number, array: any[]) => {
          channel.delete()
          if (index === array.length - 1) resolve(true);
        })
      })
    }).then(() => {
      server.delete();
      this.selectedServerIndex.next(0);
    })
  }

  modifyServer(uid: number, name: string, icon?: any) {
    let server = this.afs.doc(`servers/${uid}`).ref;
    if (icon) {
      new Promise((resolve) => {
        const storage = getStorage();
        const storageRef = ref(storage, uid.toString());
        uploadBytes(storageRef, icon).then((snapshot) => {
          getDownloadURL(storageRef).then((url) => {
            resolve(url);
          })
        });
      }).then((photoURL) => {
        server.update({
          name: name,
          photoURL: photoURL
        })
      })
    } else {
      server.update({
        name: name
      })
    }
  }

  createServer(name: string, icon?: any) {
    let uid = this.afs.createId();
    new Promise((resolve) => {
      if (icon) {
        const storage = getStorage();
        const storageRef = ref(storage, uid);
        uploadBytes(storageRef, icon).then((snapshot) => {
          getDownloadURL(storageRef).then((url) => {
            resolve(url);
          })
        });
      } else {
        resolve(defaultPhotoURL)
      }
    }).then((photoURL) => {
      this.authService.authState.pipe(takeUntil(this.notifier)).subscribe(user => {
        if (user) {
          this.afs.doc(`servers/${uid}`).set({
            uid: uid,
            name: name,
            photoURL: photoURL,
            creator: this.authService.userRef,
            members: arrayUnion(this.authService.userRef),
            channels: []
          });
        }
      })
    })
  }
}
