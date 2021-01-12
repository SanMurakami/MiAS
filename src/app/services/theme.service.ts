import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Theme} from '../pages/theme/index/index.component';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private afs: AngularFirestore) { }

  addTheme(uid: string, theme: string, themeName: string, themeDesc: string): boolean {
    let process = false;
    const id = this.afs.createId();
    const params: { uid: string; themeName: string; theme: string; themeDesc: string; id: string } = {
      uid,
      themeName,
      themeDesc,
      theme,
      id
    };
    this.afs.collection<Theme>('themes').doc(id).set(params).then(() => {
      process = true;
    });
    return process;
  }

  getTheme(): Observable<Theme[]> {
    return this.afs.collection<Theme>('themes').valueChanges();
  }

  getUserTheme(uid: string): Observable<Theme[]> {
    return this.afs.collection<Theme>('themes', ref => ref.where('uid', '==', uid)).valueChanges();
  }

  deleteTheme(id: string, uid: string): boolean {
    let process = false;
    this.afs.collection<Theme>('themes', ref => ref
      .where('uid', '==', uid)
      .where('id', '==', id)
    ).valueChanges().subscribe(result => {
      if (result.length !== 1) {
        return;
      }

      this.afs.collection('themes').doc(id).delete().then(() => {
        process = true;
      });
    });
    return process;
  }
}
