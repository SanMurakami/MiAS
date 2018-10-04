import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SwalComponent} from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild('copy') private copy: SwalComponent;
  list = [];
  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.httpClient.get<any[]>(environment.api + '/api/themes/list')
      .subscribe(data => {
        data.forEach(a => {
          this.list.push(JSON.parse(a.theme));
        });
      });
  }

}
