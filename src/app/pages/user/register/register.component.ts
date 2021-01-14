import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService, User} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(data => {
      this.afs.collection<User>('users', ref => ref.where('uid', '==', data?.uid))
        .valueChanges()
        .subscribe(result => {
          if (result.length !== 0) {
            this.router.navigate(['/']);
          }
        });
    });
  }

}
