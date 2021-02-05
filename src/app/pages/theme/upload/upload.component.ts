import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {FormControl, Validators} from '@angular/forms';
import * as json5 from 'json5';
import {AngularFirestore} from '@angular/fire/firestore';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Theme, ThemeScreenshot} from '../../../services/theme.service';

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
      const themeString = json5.stringify(parsedTheme);
      const encoder = new TextEncoder();
      const buf = await crypto.subtle.digest('SHA-256', encoder.encode(themeString));
      const themeHash = [].map.call(new Uint8Array(buf), (b: number) => b.toString(16).padStart(2, '0')).join('');
      this.themeValidate = 0;

      const result = await this.afs.collection<Theme>('themes', ref => ref.where('hash', '==', themeHash)).get().toPromise();
      if (result.size !== 0) {
        this.themeValidate = 2;
        return;
      }

      const params: Theme = {
        uid: this.uid,
        theme: themeString,
        hash: themeHash,
        date: new Date().getTime(),
        name: parsedTheme.name,
        base: parsedTheme.base
      };
      await this.afs.collection<Theme>('themes').doc(themeHash).set(params);
      const body = 'theme=' + themeString;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      const options = {headers};
      this.httpClient.post<ThemeScreenshot>('https://theme-screenshot.misskey.io', body, options).subscribe(
        (res: ThemeScreenshot) => {
          console.log(res);
        }
      );
    } catch (e) {
      console.log(e);
      this.themeValidate = 1;
    }
  }

}
