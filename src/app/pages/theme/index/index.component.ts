import { Component, OnInit } from '@angular/core';
import {Theme} from '../../../services/theme.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  themes: Theme[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
