import { NgModule } from '@angular/core';
import {NotifierModule, NotifierService} from 'angular-notifier';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {LoginComponent} from './login/login.component';
import {SecurityRoutingModule} from './security-routing/security-routing.module';
import {CommonsModule} from '../commons/commons.module';

@NgModule({
  declarations: [
   LoginComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    CommonsModule
  ],
  providers: [NotifierService],
  exports: []
})
export class SecurityModule { }
