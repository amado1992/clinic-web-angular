import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Device } from 'src/app/models/device.model';

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrls: ['./device-edit.component.scss']
})
export class DeviceEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;

  deviceForm: FormGroup;

  @Input() device: Device;
  @Input() localizacionesRegistradas: any[];


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

    this.deviceForm = this.fb.group(
      {
        id: [null],
        name: [null],
        locationId: [null],
        identificadorDispositivo: [null],
        infoCheck: [null]
      }
    );

    this.deviceForm.enable();

    if (this.device) {
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

    this.deviceForm.get('id').setValue(this.device.id);
    this.deviceForm.get('name').setValue(this.device.nombre);
    this.deviceForm.get('identificadorDispositivo').setValue(this.device.identificadorDispositivo);
    var locationId = (this.device.localizacion) ? +this.device.localizacion.id : this.localizacionesRegistradas[0].id;
    this.deviceForm.get('locationId').setValue(locationId);
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

    this.device =
    {
      id: this.deviceForm.get('id').value,
      nombre: this.deviceForm.get('name').value,
      identificadorDispositivo: this.deviceForm.get('identificadorDispositivo').value,
      localizacion: { id: +this.deviceForm.get('locationId').value },
      tokenNotificacion: null
    };

    //actualizar
    this.dataSubscription = this.adminService.updateDevice(this.device)
      .subscribe(
        (data: any) => {

          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {

          this.notifyUpdateError(error);

          if (this.deviceForm.get('id').value == null)
          {
            this.device = null;
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
