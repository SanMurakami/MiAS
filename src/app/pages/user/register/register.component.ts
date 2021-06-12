import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService, User} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z0-9\-\@\_\.]+')
  ]);

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(data => {
      const userSubscription = this.afs.collection<User>('users', ref => ref.where('uid', '==', data?.uid))
        .valueChanges()
        .subscribe(result => {
          if (result.length !== 0) {
            this.router.navigate(['/']);
          }
          userSubscription.unsubscribe();
        });
    });
  }

  register(): void {
    this.auth.user$.subscribe(data => {
      const params: User = {
        uid: data?.uid,
        name: this.registerFormControl.value,
        photo: data?.photoURL
      };
      this.afs.collection<User>('users').doc(data?.uid).set(params);
      this.router.navigate(['/']);
    });
  }

}
