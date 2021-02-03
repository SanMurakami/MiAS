import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../../services/theme.service';
import {AuthService} from '../../../services/auth.service';
import {FormControl, Validators} from '@angular/forms';
import * as json5 from 'json5';
import {AngularFirestore} from '@angular/fire/firestore';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export interface Theme {
  uid: string | undefined;
  theme: string;
  hash: string;
  date: number;
  name: string;
  desc: string;
  base: string;
}

export interface ThemeScreenshot {
  home: string;
  note: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  uid: string | undefined;
  themeValidate = 0;

  themeFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private theme: ThemeService,
    private auth: AuthService,
    private afs: AngularFirestore,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(data => {
      this.uid = data?.uid;
    });
  }

  async upload(): Promise<void> {
    try {
      const theme = this.themeFormControl.value as string;
      const parsedTheme = json5.parse(theme);
      this.themeValidate = 0;
      const buff = new Uint8Array(theme.split('').map((c: string) => c.charCodeAt(0))).buffer;
      const digest = await crypto.subtle.digest('SHA-256', buff);
      const themeHash = [].map.call(new Uint8Array(digest), (x: number) => ('00' + x.toString(16)).slice(-2)).join('');

      const result = await this.afs.collection<Theme>('themes', ref => ref.where('hash', '==', themeHash)).get().toPromise();
      if (result.size !== 0) {
        this.themeValidate = 2;
        return;
      }

      const params: Theme = {
        uid: this.uid,
        theme,
        hash: themeHash,
        date: new Date().getTime(),
        name: parsedTheme.name,
        desc: parsedTheme.desc,
        base: parsedTheme.base
      };
      await this.afs.collection<Theme>('themes').doc(themeHash).set(params);
      // https://theme-screenshot.misskey.io
      const body = 'theme=' + theme;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      const options = {headers};
      this.httpClient.post<ThemeScreenshot>('https://theme-screenshot.misskey.io', body, options).subscribe(
        (res: ThemeScreenshot) => {
          console.log(res);
        }
      );
    } catch (e) {
      this.themeValidate = 1;
    }
  }

}
