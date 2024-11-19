import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private notifierService: NotifierService,
              public translate: TranslateService) {
  }

  correctOperation() {
    let message;
    this.translate.get('commons.correct-operation').subscribe(
      (v) => {
        message = v;
        this.notify({message: message, success: true});
      }
    );
  }

  wrongOperation(error) {
    const language = this.translate.currentLang;
    const message = error[language.toUpperCase()];
    this.notify({message: message, success: false});
  }

  generalMessage(success: boolean, message: string) {
    this.notify({message: message, success: success});
  }

  private notify(response: {message: string, success: boolean}) {
    if (response.success) {
      this.notifierService.show( {
        type: 'success',
        message: response.message,
      } );
    } else {
      this.notifierService.show( {
        type: 'error',
        message: response.message,
      } );
    }
  }
}
