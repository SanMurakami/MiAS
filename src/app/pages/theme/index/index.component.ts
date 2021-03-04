import { Component, OnInit } from '@angular/core';
import {AuthService, User} from '../../../services/auth.service';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import {Theme} from '../../../services/theme.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  themes: Theme[] = [];

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.afs.collection<Theme>('themes').get().subscribe(result => {
      result.forEach(doc => {
        this.themes.push(doc.data());
      });
    });
  }

  getUser(user: DocumentReference): void {
    user.get().then(data => {
      console.log(data.data());
    });
  }
}
