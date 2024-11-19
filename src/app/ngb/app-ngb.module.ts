import { NgModule } from '@angular/core';
import {
  NgbTabsetModule,
  NgbDropdownModule,
  NgbTooltipModule,
  NgbModalModule,
  NgbCollapseModule,
  NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    NgbTabsetModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbCollapseModule,
    NgbTypeaheadModule
  ],
  exports: [
    NgbTabsetModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbCollapseModule,
    NgbTypeaheadModule
  ]
})
export class AppNgbModule { }
