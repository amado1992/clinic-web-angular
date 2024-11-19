import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Codificador } from 'src/app/models/codificador.model';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-encoder-edit',
  templateUrl: './encoder-edit.component.html',
  styleUrls: ['./encoder-edit.component.scss']
})
export class EncoderEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;

  encoderForm: FormGroup;
  
  @Input() clasificadoresRegistrados: any[];
  @Input() encoder: Codificador;

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

    this.encoderForm = this.fb.group(
      {
        id: [null],
        name: [null],
        codigo: [null],
        clasificador: [null],
        infoCheck: [null]
      }
    );

    this.encoderForm.enable();

    if (this.encoder) {
      this.initFormEncoder();
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

  private initFormEncoder() {

    this.encoderForm.get('id').setValue(this.encoder.id);
    this.encoderForm.get('name').setValue(this.encoder.nombre);
    this.encoderForm.get('codigo').setValue(this.encoder.codigo);
    this.encoderForm.get('clasificador').setValue(this.encoder.clasificador.id);
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

    var clasificadorIds: any = { id: + this.encoderForm.get('clasificador').value };

    this.encoder =
    {
      id: this.encoderForm.get('id').value,
      nombre: this.encoderForm.get('name').value,
      codigo: this.encoderForm.get('codigo').value,
      clasificador: clasificadorIds,
    };

    //actualizar
    this.dataSubscription = this.adminService.updateCodCodificador(this.encoder)
      .subscribe(
        (data: any) => {

          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {

          this.notifyUpdateError(error);

          if(this.encoderForm.get('id').value == null)
          {
            this.encoder = null;
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
