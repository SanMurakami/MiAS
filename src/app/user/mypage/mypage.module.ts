import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MypageRoutingModule } from './mypage-routing.module';
import { MypageComponent } from './mypage.component';

@NgModule({
  imports: [
    CommonModule,
    MypageRoutingModule
  ],
  declarations: [MypageComponent]
})
export class MypageModule { }
