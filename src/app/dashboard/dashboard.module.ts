import { NgModule } from '@angular/core';
import {ChartsModule} from 'ng2-charts';

import { GraphicComponent } from './graphic/graphic.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {CommonModule} from '@angular/common';
import { CommonsModule } from '../commons/commons.module';
import { AppNgbModule } from '../ngb/app-ngb.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    ChartsModule,
    DashboardRoutingModule,
    AppNgbModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [GraphicComponent],
  exports: [GraphicComponent]
})
export class DashboardModule { }
