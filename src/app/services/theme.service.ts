import {Injectable} from '@angular/core';

export interface Theme {
  uid: string | undefined;
  theme: string;
  hash: string;
  date: number;
  name: string;
  base: string;
}

export interface ThemeScreenshot {
  home: string;
  note: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {}
