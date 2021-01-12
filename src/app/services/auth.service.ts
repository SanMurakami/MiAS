import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import auth = firebase.auth;

export interface User {
  uid: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = this.afAuth.user;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
  }

  login(): void {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then(data => {
      this.afs.collection<User>('users', ref => ref.where('uid', '==', data.user?.uid))
        .valueChanges()
        .subscribe(result => {
          if (result.length !== 1) {
            this.router.navigate(['/user/register']);
          }
        });
    });
  }

  logout(): void {
    this.afAuth.signOut();
  }
}
