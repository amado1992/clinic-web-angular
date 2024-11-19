import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { OpcionPago } from 'src/app/models/opcionPago.model';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment-edit',
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.scss']
})
export class PaymentEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;

  paymentForm: FormGroup;
  
  @Input() payment: OpcionPago;

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

    this.paymentForm = this.fb.group(
      {
        id: [null],
        name: [null],
        description: [null],
        insurance: [null],
        infoCheck: [null]
      }
    );

    this.paymentForm.enable();

    if (this.payment) {
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

    this.paymentForm.get('id').setValue(this.payment.id);
    this.paymentForm.get('name').setValue(this.payment.nombre);
    this.paymentForm.get('description').setValue(this.payment.descripcion); 
    this.paymentForm.get('insurance').setValue((this.payment.tipoSeguro && this.payment.tipoSeguro === "1") ? true : false); 
  }
  onCheckboxAcceptChange(e) {

    this.creating = e.target.checked;
  }

  get disabled(): boolean {
    return false; //!this.selectedLaboratory;
  }

  okUpdate() {

    this.updateData = true;

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    this.payment =
    {
      id: this.paymentForm.get('id').value,
      nombre: this.paymentForm.get('name').value,
      descripcion: this.paymentForm.get('description').value,
      tipoSeguro: this.paymentForm.get('insurance').value ? "1" : "0"
    };

    //actualizar
    this.dataSubscription = this.adminService.updateOpcionPago(this.payment)
      .subscribe(
        (data: any) => {
console.log("Update pago... ", data)
          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {

          this.notifyUpdateError(error);

          if(this.paymentForm.get('id').value == null)
          {
            this.payment = null;
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

