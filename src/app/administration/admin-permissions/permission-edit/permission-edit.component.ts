import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Permiso } from 'src/app/models/permiso.model';

@Component({
  selector: 'app-permission-edit',
  templateUrl: './permission-edit.component.html',
  styleUrls: ['./permission-edit.component.scss']
})
export class PermissionEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;

  permissionForm: FormGroup;
  
  @Input() permission: Permiso;

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

    this.permissionForm = this.fb.group(
      {
        id: [null],
        name: [null],
        description: [null],
        infoCheck: [null]
      }
    );

    this.permissionForm.enable();

    if (this.permission) {
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

    this.permissionForm.get('id').setValue(this.permission.id);
    this.permissionForm.get('name').setValue(this.permission.nombre);
    this.permissionForm.get('description').setValue(this.permission.descripcion); 
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

    this.permission =
    {
      id: this.permissionForm.get('id').value,
      nombre: this.permissionForm.get('name').value,
      descripcion: this.permissionForm.get('description').value
    };

    //actualizar
    this.dataSubscription = this.adminService.updatePermission(this.permission)
      .subscribe(
        (data: any) => {

          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {

          this.notifyUpdateError(error);

          if(this.permissionForm.get('id').value == null)
          {
            this.permission = null;
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
