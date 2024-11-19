import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNgbModule } from '../ngb/app-ngb.module';
import { ReportRoutingModule } from './report-routing/report-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonsModule } from '../commons/commons.module';
import { ReportHomeComponent } from './report-home/report-home.component';
import { ReportTreatmentComponent } from './report-treatment/report-treatment.component';
import { ReportAssistanceComponent } from './report-assistance/report-assistance.component';
import {ReportPatientComponent} from './report-patient/report-assistance.component';
import { ReportDailyComponent } from './report-daily/report-daily.component';
import { ReportListPatientComponent } from './report-list-patient/report-list-patient.component';
import { ReportTipComponent } from './report-tip/report-tip.component';

@NgModule({
  imports: [
    CommonModule,
    AppNgbModule,
    ReportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonsModule
  ],
  declarations: [
    ReportHomeComponent,
    ReportTreatmentComponent,
    ReportAssistanceComponent,
    ReportPatientComponent,
    ReportDailyComponent,
    ReportListPatientComponent,
    ReportTipComponent
  ],
  entryComponents: [

  ],
  providers: [
  ]
})
export class ReportModule { }
