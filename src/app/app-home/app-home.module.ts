import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotifierModule} from 'angular-notifier';
import {NgbTooltipModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {MatSidenavModule} from '@angular/material';

import {AppHomeComponent} from './app-home.component';
import {HomeSidebarComponent} from './home-sidebar/home-sidebar.component';
import {AppHomeRoutingModule} from './app-home-routing.module';
import {CommonsModule} from '../commons/commons.module';
import {DashboardModule} from '../dashboard/dashboard.module';
import {HomeHeaderComponent} from './home-header/home-header.component';


@NgModule({
  imports: [
    CommonModule,
    AppHomeRoutingModule,
    NgbTooltipModule,
    NgbDropdownModule,
    DashboardModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'bottom',
          distance: 60,
          gap: 10
        }
      },
      behaviour: {
        autoHide: 1500,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      }
    }),
    CommonsModule,
    MatSidenavModule
  ],
  exports: [],
  declarations: [AppHomeComponent, HomeHeaderComponent, HomeSidebarComponent],
  providers: []
})
export class AppHomeModule {
}
