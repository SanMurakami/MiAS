import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'list',
    loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
  }, {
    path: 'upload',
    loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule),
    canActivate: [AngularFireAuthGuard]
  }, {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
