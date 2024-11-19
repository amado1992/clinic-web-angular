import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ICompany, OpcionPago } from 'src/app/models/opcionPago.model';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;

  companyForm: FormGroup;
  
  //@Input() company: ICompany;
  company: ICompany;

  currentLang: string;
  langSubscription: Subscription;

  updateData: boolean;

  dataSubscription: Subscription;

  creating = false;

  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal, private translateService: TranslateService,
    private messageService: MessageService, private adminService: AdminUsersService, public bsModalRef: BsModalRef) { }
  
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

    this.companyForm = this.fb.group(
      {
        id: [null],
        name: [null, Validators.required],
        description: [null, Validators.required],
        insurance: [null],
        infoCheck: [null]
      }
    );

    this.companyForm.enable();
       
    if (this.company) {
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

    this.companyForm.get('id').setValue(this.company.id);
    this.companyForm.get('name').setValue(this.company.nombre);
    this.companyForm.get('description').setValue(this.company.descripcion); 
    //this.companyForm.get('insurance').setValue((this.company.tipoSeguro && this.company.tipoSeguro === "1") ? true : false); 
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

    this.company =
    {
      id: this.companyForm.get('id').value,
      nombre: this.companyForm.get('name').value,
      descripcion: this.companyForm.get('description').value
    };

    //actualizar
    this.dataSubscription = this.adminService.updateInsuranceCompany(this.company)
      .subscribe(
        (data: any) => {

          this.updateData = false;
          this.bsModalRef.hide()
          this.notifyUpdateSuccess()
          //this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {
          console.log("My error ", error)
          this.notifyUpdateError(error);

          if(this.companyForm.get('id').value == null)
          {
            this.company = null;
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
    //this.activeModal.close({ confirmed: false });
    this.bsModalRef.hide()
    //this.bsModalRef.content.closeBtnName = 'Close';
  }

  private notifyUpdateSuccess() {
    this.messageService.correctOperation();
  }
}

