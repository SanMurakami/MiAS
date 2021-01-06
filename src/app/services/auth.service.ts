import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import auth = firebase.auth;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = this.afAuth.user;

  constructor(private afAuth: AngularFireAuth) {
  }

  login(): void {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
  }

  logout(): void {
    this.afAuth.signOut();
  }
}
