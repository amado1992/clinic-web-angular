import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GraphicComponent} from './graphic/graphic.component';

const dashboardRoutes: Routes = [
  {path: '', component: GraphicComponent}
];
@NgModule({
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class DashboardRoutingModule { }
