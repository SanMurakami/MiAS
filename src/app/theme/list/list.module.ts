import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';
import {ClipboardModule} from 'ngx-clipboard';
import {HttpClientModule} from '@angular/common/http';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  imports: [
    CommonModule,
    ListRoutingModule,
    ClipboardModule,
    HttpClientModule,
    SweetAlert2Module.forRoot()
  ],
  declarations: [ListComponent]
})
export class ListModule { }
