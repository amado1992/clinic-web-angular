import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './security/auth-guard.service';
import { NotFoundComponent } from './not-found/not-found.component';

const appRoutes: Routes = [
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadChildren: 'src/app/app-home/app-home.module#AppHomeModule'
  },
  { path: 'login', loadChildren: 'src/app/security/security.module#SecurityModule' },
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
