import {Component, Inject, OnInit} from '@angular/core';
import {AuthService, User} from '../../../services/auth.service';
import {FormControl, Validators} from '@angular/forms';
import * as json5 from 'json5';
import {AngularFirestore} from '@angular/fire/firestore';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Theme, ThemeScreenshot} from '../../../services/theme.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  uid: string | undefined;
  progress = false;

  themeFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(data => {
      this.uid = data?.uid;
      const userSubscription = this.afs.collection<User>('users', ref => ref.where('uid', '==', this.uid))
        .valueChanges()
        .subscribe(result => {
          if (result.length !== 1) {
            this.router.navigate(['/user/register']);
          }
          userSubscription.unsubscribe();
        });
    });
  }

  async upload(): Promise<void> {
    this.progress = true;
    try {
      // フォームに入力されたテーマを取得
      const theme = this.themeFormControl.value as string;
      // テーマをパースする（パース出来なければエラーになる）
      const parsedTheme = json5.parse(theme);
      // JSON5でパースしたデータを文字列に戻す
      const themeString = json5.stringify(parsedTheme);
      // テーマのハッシュを計算
      const encoder = new TextEncoder();
      const buf = await crypto.subtle.digest('SHA-256', encoder.encode(themeString));
      const themeHash = [].map.call(new Uint8Array(buf), (b: number) => b.toString(16).padStart(2, '0')).join('');

      // Firestoreから同じハッシュのテーマを検索
      const result = await this.afs.collection<Theme>('themes', ref => ref.where('hash', '==', themeHash)).get().toPromise();
      // 同じハッシュのテーマが存在する場合はエラーを出す
      if (result.size !== 0) {
        this.progress = false;
        this.dialog.open(ErrorDialogComponent, {data: {error: 2}});
        return;
      }

      // Firestoreに保存するためのデータ
      const params = {
        user: this.uid,
        username: (await this.afs.doc<User>('/users/' + this.uid).get().toPromise()).data()?.name,
        theme: themeString,
        hash: themeHash,
        date: new Date().getTime(),
        name: parsedTheme.name,
        base: parsedTheme.base
      } as Theme;
      // Firestoreに保存
      await this.afs.collection<Theme>('themes').doc(themeHash).set(params);
      // スクリーンショットAPI用リクエストパラメータ
      const body = 'theme=' + themeString;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      const options = {headers};
      this.httpClient.post<ThemeScreenshot>('https://theme-screenshot.misskey.io', body, options).subscribe(
        (res: ThemeScreenshot) => {
          this.dialog.open(SuccessDialogComponent);
          this.progress = false;
        }
      );
    } catch (e) {
      // テーマ形式が正しくない場合
      console.log(e);
      this.dialog.open(ErrorDialogComponent, {data: {error: 1}});
      this.progress = false;
    }
  }

}



// アップロード成功時ダイアログ
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'success-dialog',
  template: `<h1 mat-dialog-title>Success</h1>
  <div mat-dialog-content>This theme has been uploaded successfully!</div>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close routerLink="/theme/list">OK</button>
  </div>`
})
export class SuccessDialogComponent {
  constructor() {
  }
}



// アップロードエラー時ダイアログ
interface DialogData {
  error: number;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'error-dialog',
  template:
    `<h1 mat-dialog-title>Error</h1>
    <div mat-dialog-content *ngIf="data.error === 1">The theme format is not correct.</div>
    <div mat-dialog-content *ngIf="data.error === 2">This theme has already been registered.</div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>OK</button>
    </div>`
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }
}
