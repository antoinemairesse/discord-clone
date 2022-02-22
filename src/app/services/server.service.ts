import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {arrayUnion} from "@angular/fire/firestore";
import {BehaviorSubject, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@angular/fire/storage";

export interface Server {
  doc: any,
  index: number,
  name: string,
  photoURL: string,
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  defaultPhotoURL: string = "https://firebasestorage.googleapis.com/v0/b/discord-clone-420ba.appspot.com/o/default-server-icon.png?alt=media&token=22b079f4-06b8-456b-a36a-4ce66471aa8a";
  selectedServer: BehaviorSubject<Server | undefined> = new BehaviorSubject<Server | undefined>(undefined);
  selectedServerIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  servers: BehaviorSubject<Server[]> = new BehaviorSubject<Server[]>([]);
  notifier: Subject<any> = new Subject<any>();

  constructor(private afs: AngularFirestore, private authService: AuthService, private storage: AngularFireStorage) {
  }

  init(): void {
    this.notifier = new Subject<any>();
    let t = localStorage.getItem('selected-server');
    if (t) {
      this.selectedServerIndex.next(parseInt(t.toString()));
    }
    this.authService.authState.pipe(takeUntil(this.notifier)).subscribe(user => {
      if (user) {
        this.afs.collection(
          'servers',
          ref => ref.where('members', "array-contains", user.uid)
        ).valueChanges().pipe(takeUntil(this.notifier)).subscribe((next: any) => {
          let servers: Server[] = [];
          next.forEach((server: any) => {
            servers.push({
              doc: server,
              index: servers.length,
              name: server.name,
              photoURL: server.photoURL
            })
          })
          this.servers.next(servers);

          let sub = this.selectedServerIndex.subscribe((next: any) => {
            this.selectedServer.next(servers[next]);
          })
          sub.unsubscribe()
        })
      }
    })
  }

  destroy(): void {
    this.servers.next([]);
    this.selectedServer.next(undefined);
    this.selectedServerIndex.next(0);

    this.notifier.next()
    this.notifier.complete()
  }

  selectServer(index: number) {
    localStorage.setItem('selected-server', index.toString());
    let sub = this.servers.pipe(takeUntil(this.notifier)).subscribe((servers: any) => {
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
                members: arrayUnion(next.uid)
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
        resolve(this.defaultPhotoURL)
      }
    }).then((photoURL) => {
      this.authService.authState.pipe(takeUntil(this.notifier)).subscribe(user => {
        if (user) {
          this.afs.doc(`servers/${uid}`).set({
            uid: uid,
            name: name,
            photoURL: photoURL,
            creator: user.uid,
            members: arrayUnion(user.uid),
            channels: []
          });
        }
      })
    })
  }
}
