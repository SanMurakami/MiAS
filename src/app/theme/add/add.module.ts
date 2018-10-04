import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoutingModule } from './add-routing.module';
import { AddComponent } from './add.component';
import {HttpClientModule} from '@angular/common/http';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';

@NgModule({
  imports: [
    CommonModule,
    AddRoutingModule,
    HttpClientModule,
    SweetAlert2Module.forRoot()
  ],
  declarations: [AddComponent]
})
export class AddModule { }
