import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  @ViewChild('addSuccess') private addSuccess: SwalComponent;
  code: any;
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
  }

  submit() {
    const body = 'theme=' + JSON.stringify(new Function('return ' + this.code)());
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const options = {headers: headers};
    this.httpClient.post(environment.api + '/api/themes/add', body, options)
      .subscribe(
        () => {
          this.addSuccess.show().then(() => {
            this.router.navigate(['/theme/list']);
          });
        }
      );

  }

}
