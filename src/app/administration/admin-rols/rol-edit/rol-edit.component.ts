import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Subscription, forkJoin } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from 'src/app/models/role.model';
import { Permiso } from 'src/app/models/permiso.model';

@Component({
  selector: 'app-rol-edit',
  templateUrl: './rol-edit.component.html',
  styleUrls: ['./rol-edit.component.scss']
})
export class RolEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;

  roleForm: FormGroup;

  @Input() permisosRegistrados: any[];
  @Input() roleId: string;

  currentLang: string;
  langSubscription: Subscription;

  loadingData: boolean;
  errorLoadingData: boolean;

  updateData: boolean;

  dataSubscription: Subscription;

  rol: Role = null;

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

    this.roleForm = this.fb.group(
      {
        id: [null],
        name: [null],
        description: [null],
        checkPermissionsArray: this.fb.array([]),
        infoCheck: [null]
      }
    );

    this.roleForm.enable();

    if (+this.roleId > 0) {
      this.initDataFilter();
    }
    else {
      this.roleId = "0";
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

  private initDataFilter() {
    this.loadingData = true;
    this.errorLoadingData = false;
    const sources = [
      this.adminService.getRol(this.roleId)
    ]
    this.dataSubscription = forkJoin(sources)
      .subscribe(
        ([rol]: [Role]) => {
          this.rol = rol;

          if (this.roleForm)
            this.initFormRole();

          this.loadingData = false;
        },
        (error: HttpErrorResponse) => {
          this.loadingData = false;
          this.errorLoadingData = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang === "es-ES" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        });
  }

  onCheckboxPermissionsChange(e) {

    const checkPermissionsArray: FormArray = this.roleForm.get('checkPermissionsArray') as FormArray;

    if (e.target.checked) 
    {
      checkPermissionsArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkPermissionsArray.controls.forEach((item: FormControl) => {

        if (item.value == e.target.value) {
          checkPermissionsArray.removeAt(i);

          return;
        }
        i++;
      });
    }
  }

  onCheckboxAcceptChange(e) {

    this.creating = e.target.checked;
  }

  buildCheckPermissions(): any[] {
    var permissionsIds: any[] = [];

    const checkPermissionsArray: FormArray = this.roleForm.get('checkPermissionsArray') as FormArray;
    checkPermissionsArray.controls.forEach((item: FormControl) => {
      permissionsIds.push({ id: +item.value });
    });

    return permissionsIds;
  }

  get disabled(): boolean {
    return false; //!this.selectedLaboratory;
  }

  IsPermissionChecked(id: number): boolean {

    const checkPermissionsArray: FormArray = this.roleForm.get('checkPermissionsArray') as FormArray;

    var found: boolean = false;
    checkPermissionsArray.controls.forEach((item: FormControl) => {
      if (+item.value == id) {
        found = true;
      }
    });

    return found;
  }

  okUpdate() {

    this.updateData = true;

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    var permissionsIds = this.buildCheckPermissions();

    this.rol =
    {
      id: this.roleForm.get('id').value,
      nombre: this.roleForm.get('name').value,
      descripcion: this.roleForm.get('description').value,
      permisos: permissionsIds
    };

    //actualizar
    this.dataSubscription = this.adminService.updateRol(this.rol)
      .subscribe(
        (data: any) => {

          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {

          this.notifyUpdateError(error);

          this.creating = false;

          this.updateData = false;
        }
      )
  }

  cancelUpdate() {
    this.activeModal.close({ confirmed: false });
  }

  private initFormRole() {

    this.roleForm.get('id').setValue(this.rol.id);
    this.roleForm.get('name').setValue(this.rol.nombre);
    this.roleForm.get('description').setValue(this.rol.descripcion);

    this.initCheckboxPermissionsChange();

  }

  initCheckboxPermissionsChange() {

    if (this.rol && this.rol.permisos && this.rol.permisos.length > 0) {
      const checkPermissionsArray: FormArray = this.roleForm.get('checkPermissionsArray') as FormArray;

      this.rol.permisos.forEach((item: Permiso) => {
        checkPermissionsArray.push(new FormControl(item.id));
      });
    }
  }

  private notifyUpdateError(error: any) {
    this.messageService.wrongOperation(error.error.message);
  }
}
