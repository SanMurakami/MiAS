import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  @ViewChild('addSuccess', { static: true }) private addSuccess: SwalComponent;
  @ViewChild('addError', { static: true }) private addError: SwalComponent;
  code: string;
  delkey: string;
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
  }

  submit() {
    if (!this.isValidJson(this.code)) {
      this.addError.fire();
      return;
    }

    const body = 'theme=' + JSON.stringify(new Function('return ' + this.code)()) + '&delkey=' + this.delkey;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const options = {headers: headers};
    this.httpClient.post(environment.api + '/api/themes/add', body, options)
      .subscribe(
        () => {
          this.addSuccess.fire().then(() => {
            this.router.navigate(['/theme/list']);
          });
        }, error => {
          this.addError.fire();
        }
      );

  }

  isValidJson(value) {
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    }
    return true;
  }

}
