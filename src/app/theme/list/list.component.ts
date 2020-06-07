import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild('copy', { static: true }) private copy: SwalComponent;
  list = [];
  selectVersion = 11;
  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.httpClient.get<any[]>(environment.api + '/api/themes/list')
      .subscribe(data => {
        data.forEach(a => {
          this.list.push({
            id: a.id,
            theme: JSON.parse(a.theme),
            version: a.version
          });
          console.log(JSON.parse(a.theme));
        });
      });
  }

}
