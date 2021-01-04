import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/index/index.module').then(m => m.IndexModule)
  }, {
    path: 'theme',
    loadChildren: () => import('./pages/theme/theme.module').then(m => m.ThemeModule)
  }, {
    path: '404',
    loadChildren: () => import('./pages/notfound/notfound.module').then(m => m.NotfoundModule)
  }, {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
