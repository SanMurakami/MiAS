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
    private auth: AuthService,
    private afs: AngularFirestore,
    private httpClient: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(data => {
      this.uid = data?.uid;
    });
  }

  async upload(): Promise<void> {
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
      // 上記処理通過後エラー表示を消す
      this.themeValidate = 0;

      // Firestoreから同じハッシュのテーマを検索
      const result = await this.afs.collection<Theme>('themes', ref => ref.where('hash', '==', themeHash)).get().toPromise();
      // 同じハッシュのテーマが存在する場合はエラーを出す
      if (result.size !== 0) {
        this.themeValidate = 2;
        return;
      }

      // Firestoreに保存するためのデータ
      const params: Theme = {
        uid: this.uid,
        theme: themeString,
        hash: themeHash,
        date: new Date().getTime(),
        name: parsedTheme.name,
        base: parsedTheme.base
      };
      // Firestoreに保存
      await this.afs.collection<Theme>('themes').doc(themeHash).set(params);
      // スクリーンショットAPI用リクエストパラメータ
      const body = 'theme=' + themeString;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      const options = {headers};
      this.httpClient.post<ThemeScreenshot>('https://theme-screenshot.misskey.io', body, options).subscribe(
        (res: ThemeScreenshot) => {
          // todo: スクリーンショットが帰ってきたらダイアログを出したり・・・
          console.log(res);
        }
      );
    } catch (e) {
      // テーマ形式が正しくない場合
      this.themeValidate = 1;
    }
  }

}
