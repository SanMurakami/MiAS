import { Component, OnInit } from '@angular/core';

export interface Theme {
  uid: string;
  themeName: string;
  themeDesc: string;
  theme: string;
  id: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
