import {Component, Input, OnInit} from '@angular/core';
import {ThemeService} from '../../../services/theme.service';
import {AuthService} from '../../../services/auth.service';
import {FormControl, Validators} from '@angular/forms';
import * as json5 from 'json5';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  uid: string | undefined;
  themeValidate?: boolean;

  themeFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private theme: ThemeService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(data => {
      this.uid = data?.uid;
    });
  }

  upload(): void {
    try {
      const validate = json5.parse(this.themeFormControl.value);
      this.themeValidate = true;
    } catch (e) {
      this.themeValidate = false;
    }
  }

}
