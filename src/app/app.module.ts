import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {NotifierModule} from 'angular-notifier';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import { ConfirmationModalComponent } from './services/confirmation-modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalService } from './services/confirmation-modal/confirmation-modal.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { httpInterceptorProviders } from './services/interceptors/interceptors.barrel';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationModalComponent,
    NotFoundComponent
  ],
  entryComponents: [ConfirmationModalComponent],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    NgbModalModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
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
        autoHide: 30000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      }
    }),
  ],
  providers: [
    ConfirmationModalService,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
}
