import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../login/login.component';

const securityRoutes: Routes = [
  {path: '', component: LoginComponent}
];
@NgModule({
  imports: [
    RouterModule.forChild(securityRoutes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class SecurityRoutingModule { }
