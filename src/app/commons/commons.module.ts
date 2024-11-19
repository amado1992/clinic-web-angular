import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PressKeyActionComponent } from './press-key-action/press-key-action.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { LoadImageComponent } from './load-image/load-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    NgbModule,
    TranslateModule,
    FontAwesomeModule
  ],
  declarations: [
    PressKeyActionComponent,
    ServerErrorComponent,
    PaginatorComponent,
    LoadImageComponent
  ],
  exports: [
    PressKeyActionComponent,
    TranslateModule,
    ServerErrorComponent,
    FontAwesomeModule,
	  PaginatorComponent,
    LoadImageComponent
  ],
  entryComponents: [],
  providers: [NgbActiveModal, DatePipe]

})
export class CommonsModule {
}
