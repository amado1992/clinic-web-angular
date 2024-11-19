import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {AppHomeComponent} from './app-home.component';

const routes: Routes = [
  {
    path: '', component: AppHomeComponent,
    children: [
      {path: 'dashboard', loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule'},
      {path: 'admin', loadChildren: 'src/app/administration/administration.module#AdministrationModule'},
      {path: 'report', loadChildren: 'src/app/reports/report.module#ReportModule'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppHomeRoutingModule { }
