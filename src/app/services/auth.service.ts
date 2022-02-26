import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {GoogleAuthProvider} from "@angular/fire/auth";
import firebase from "firebase/compat";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  userRef: any;
  constructor(private afs: AngularFirestore, private auth: AngularFireAuth, private router: Router) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        this.userRef = this.afs.collection('users').doc(user.uid).ref;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        //this.router.navigate(['login']);
      }
    })

  }

  get authState() {
    return this.auth.authState;
  }

  signUp(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password).then((result) => {
      this.setUserData(result.user);
      console.log(result.user);
    }).catch((error) => {
      console.log(error);
    })
  }

  /* Setting up user data when sign in with username/password,
sign up with username/password and sign in with social auth
provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: firebase.User | null) {
    if (user != null) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
      userRef.set(userData, {merge: true})
    }
  }

  // Sign in with Google
  googleAuth() {
    return this.auth.signInWithPopup(new GoogleAuthProvider()).then((result) => {
      this.setUserData(result.user);
      this.router.navigate(['']);
    }).catch((error) => {
      console.log(error);
    })
  }

  // Sign out
  signOut() {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }

}
