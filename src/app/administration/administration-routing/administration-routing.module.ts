import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from '../admin-home/admin-home.component';
import { EmployeeListComponent } from '../admin-employees/employee-list/employee-list.component';
import { BranchListComponent } from '../admin-branchs/branch-list/branch-list.component';
import { PermissionListComponent } from '../admin-permissions/permission-list/permission-list.component';
import { RolListComponent } from '../admin-rols/rol-list/rol-list.component';
import { RoomListComponent } from '../admin-rooms/room-list/room-list.component';
import { ServiceListComponent } from '../admin-services/service-list/service-list.component';
import { DeviceListComponent } from '../admin-devices/device-list/device-list.component';
import { AdminDatesComponent } from '../admin-dates/admin-dates.component';
import { ClassificatorListComponent } from '../admin-classificator/classificator-list/classificator-list.component';
import { EncoderListComponent } from '../admin-encoder/encoder-list/encoder-list.component';
import { PaymentListComponent } from '../admin-payment/payment-list/payment-list.component';
import { CompanyListComponent } from '../admin-company/company-list/company-list.component';
import { AdminReportComponent } from '../admin-report/admin-report.component';

const administrationRoutes: Routes = [
  {
    path: '', component: AdminHomeComponent, children: [
      { path: 'branchs', component: BranchListComponent },
      { path: 'employees', component: EmployeeListComponent },
      { path: 'permissions', component: PermissionListComponent },
      { path: 'rols', component: RolListComponent },
      { path: 'rooms', component: RoomListComponent },
      { path: 'services', component: ServiceListComponent },
      { path: 'devices', component: DeviceListComponent },
      { path: 'dates', component: AdminDatesComponent },
      { path: 'classificators', component: ClassificatorListComponent },
      { path: 'encoders', component: EncoderListComponent },
      { path: 'payments', component: PaymentListComponent },
      { path: 'companys', component: CompanyListComponent },
      { path: 'report', component: AdminReportComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(administrationRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class AdministrationRoutingModule { }
