import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportTreatmentComponent } from '../report-treatment/report-treatment.component';
import { ReportHomeComponent } from '../report-home/report-home.component';
import { ReportAssistanceComponent } from '../report-assistance/report-assistance.component';
import {ReportPatientComponent} from '../report-patient/report-assistance.component';
import { ReportDailyComponent } from '../report-daily/report-daily.component';
import { ReportListPatientComponent } from '../report-list-patient/report-list-patient.component';
import { ReportTipComponent } from '../report-tip/report-tip.component';

const reportRoutes: Routes = [
  {
    path: '', component: ReportHomeComponent, children: [
      { path: 'treatment', component: ReportTreatmentComponent},
      { path: 'assistance', component: ReportAssistanceComponent },
      { path: 'patient', component: ReportPatientComponent },
      { path: 'daily', component: ReportDailyComponent },
      { path: 'patient_list', component: ReportListPatientComponent },
      { path: 'tip', component: ReportTipComponent },
      
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class ReportRoutingModule { }
