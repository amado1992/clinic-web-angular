import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, from } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import {  NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Clasificador } from 'src/app/models/clasificador.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-classificator-edit',
  templateUrl: './classificator-edit.component.html',
  styleUrls: ['./classificator-edit.component.scss']
})
export class ClassificatorEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;

  classificatorForm: FormGroup;
  
  @Input() classificator: Clasificador;

  currentLang: string;
  langSubscription: Subscription;

  updateData: boolean;

  dataSubscription: Subscription;

  creating = false;

  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal, private translateService: TranslateService,
    private messageService: MessageService, private adminService: AdminUsersService) { }
  
  ngOnInit() {
      this.hookLang();
      this.initForm();
  }

  ngOnDestroy() {

    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private initForm() {

    this.classificatorForm = this.fb.group(
      {
        id: [null],
        classificator: [null],
        description: [null],
        infoCheck: [null]
      }
    );

    this.classificatorForm.enable();

    if (this.classificator) {
      this.initFormService();
    }
  }

  private hookLang() {
    this.currentLang = this.translateService.currentLang;
    this.langSubscription = this.translateService.onLangChange
      .subscribe(
        (langChange: LangChangeEvent) => {
          this.currentLang = langChange.lang;
        }
      );
  }


  private initFormService() {

    this.classificatorForm.get('id').setValue(this.classificator.id);
    this.classificatorForm.get('classificator').setValue(this.classificator.clasificador);
    this.classificatorForm.get('description').setValue(this.classificator.descripcion); 
  }
  onCheckboxAcceptChange(e) {

    this.creating = e.target.checked;
  }

  get disabled(): boolean {
    return false;
  }

  okUpdate() {

    this.updateData = true;

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    this.classificator =
    {
      id: this.classificatorForm.get('id').value,
      clasificador: this.classificatorForm.get('classificator').value,
      descripcion: this.classificatorForm.get('description').value
    };

    //actualizar
    this.dataSubscription = this.adminService.updateClassificator(this.classificator)
      .subscribe(
        (data: any) => {

          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {

          this.notifyUpdateError(error);

          if(this.classificatorForm.get('id').value == null)
          {
            this.classificator = null;
          }
          this.creating = false;

          this.updateData = false;
        }
      )
  }

  private notifyUpdateError(error: any) {
    this.messageService.wrongOperation(error.error.message);
  }

  cancelUpdate() {
    this.activeModal.close({ confirmed: false });
  }

}
