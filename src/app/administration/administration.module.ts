 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdministrationRoutingModule } from './administration-routing/administration-routing.module';
import {CommonsModule} from '../commons/commons.module';
import { AppNgbModule } from '../ngb/app-ngb.module';
import { BranchListComponent } from './admin-branchs/branch-list/branch-list.component';
import { BranchEditComponent } from './admin-branchs/branch-edit/branch-edit.component';
import { EmployeeListComponent } from './admin-employees/employee-list/employee-list.component';
import { EmployeeEditComponent } from './admin-employees/employee-edit/employee-edit.component';
import { PermissionEditComponent } from './admin-permissions/permission-edit/permission-edit.component';
import { PermissionListComponent } from './admin-permissions/permission-list/permission-list.component';
import { RolListComponent } from './admin-rols/rol-list/rol-list.component';
import { RolEditComponent } from './admin-rols/rol-edit/rol-edit.component';
import { RoomEditComponent } from './admin-rooms/room-edit/room-edit.component';
import { RoomListComponent } from './admin-rooms/room-list/room-list.component';
import { ServiceListComponent } from './admin-services/service-list/service-list.component';
import { ServiceEditComponent } from './admin-services/service-edit/service-edit.component';
import { DeviceEditComponent } from './admin-devices/device-edit/device-edit.component';
import { DeviceListComponent } from './admin-devices/device-list/device-list.component';
import { AdminDatesComponent } from './admin-dates/admin-dates.component';
import { ClassificatorEditComponent } from './admin-classificator/classificator-edit/classificator-edit.component';
import { ClassificatorListComponent } from './admin-classificator/classificator-list/classificator-list.component';
import { EncoderListComponent } from './admin-encoder/encoder-list/encoder-list.component';
import { EncoderEditComponent } from './admin-encoder/encoder-edit/encoder-edit.component';
import { PaymentEditComponent } from './admin-payment/payment-edit/payment-edit.component';
import { PaymentListComponent } from './admin-payment/payment-list/payment-list.component';
import { CompanyEditComponent } from './admin-company/company-edit/company-edit.component';
import { CompanyListComponent } from './admin-company/company-list/company-list.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AdminReportComponent } from './admin-report/admin-report.component';

@NgModule({
  imports: [
    CommonModule,
    AppNgbModule,
    AdministrationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonsModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    AdminHomeComponent,
    BranchListComponent,
    BranchEditComponent,
    EmployeeListComponent,
    EmployeeEditComponent,
    PermissionEditComponent,
    PermissionListComponent,
    RolListComponent,
    RolEditComponent,
    RoomEditComponent,
    RoomListComponent,
    ServiceListComponent,
    ServiceEditComponent,
    DeviceEditComponent,
    DeviceListComponent,
    AdminDatesComponent,
    ClassificatorEditComponent,
    ClassificatorListComponent,
    EncoderListComponent,
    EncoderEditComponent,
    PaymentEditComponent,
    PaymentListComponent,
    CompanyListComponent,
    CompanyEditComponent,
    AdminReportComponent
  ],
  entryComponents: [
    EmployeeEditComponent,
    ServiceEditComponent,
    BranchEditComponent,
    RoomEditComponent,
    PermissionEditComponent,
    RolEditComponent,    
    DeviceEditComponent,
    ClassificatorEditComponent,
    EncoderEditComponent,
    PaymentEditComponent,
    CompanyEditComponent
  ],
  providers: [
  ]
})
export class AdministrationModule { }
