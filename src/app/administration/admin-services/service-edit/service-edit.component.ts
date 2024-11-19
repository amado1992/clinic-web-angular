import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Subscription, forkJoin } from 'rxjs';
import { Servicio } from 'src/app/models/servicio.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.scss']
})
export class ServiceEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;

  serviceForm: FormGroup;
  
  @Input() ramasRegistradas: any[];
  @Input() service: Servicio;

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

    this.serviceForm = this.fb.group(
      {
        id: [null],
        name: [null],
        description: [null],
        branchId: [null],
        color: [null],
        infoCheck: [null],
        version: [null],
      }
    );

    this.serviceForm.enable();

    if (this.service) {
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

    this.serviceForm.get('id').setValue(this.service.id);
    this.serviceForm.get('name').setValue(this.service.nombre);
    this.serviceForm.get('description').setValue(this.service.descripcion);
    this.serviceForm.get('branchId').setValue(this.service.rama.id);
    this.serviceForm.get('color').setValue(this.service.color);   
    this.serviceForm.get('version').setValue(this.service.version);
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

    var ramaIds: any = { id: + this.serviceForm.get('branchId').value };

    this.service =
    {
      id: this.serviceForm.get('id').value,
      nombre: this.serviceForm.get('name').value,
      descripcion: this.serviceForm.get('description').value,
      rama: ramaIds,
      color: this.serviceForm.get('color').value,
      version: this.serviceForm.get('version').value,
    };
    console.log(this.service);
    //actualizar
    this.dataSubscription = this.adminService.updateService(this.service)
      .subscribe(
        (data: any) => {

          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {

          this.notifyUpdateError(error);

          if(this.serviceForm.get('id').value == null)
          {
            this.service = null;
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
