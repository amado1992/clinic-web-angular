import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { faCog, faImage } from '@fortawesome/free-solid-svg-icons';
import { Role } from 'src/app/models/role.model';
import { Servicio } from 'src/app/models/servicio.model';
import { Specialist } from 'src/app/models/specialist.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;
  faPictureIcon = faImage;
  imageToShow: any;
  imageToSend: any;
  imageRecovery:any;

  employeeForm: FormGroup;

  @Input() rolesRegistrados: any[];
  @Input() especialidadesRegistradas: any[];
  @Input() serviciosRegistrados: any[];
  @Input() employeeId: string;

  currentLang: string;
  langSubscription: Subscription;

  loadingData: boolean;
  errorLoadingData: boolean;

  updateData: boolean;

  dataSubscription: Subscription;

  empleado: User = null;

  creating = false;

  employeeSpecialty: number;

  imageChange: boolean;

  currentRol: string = "";

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

    this.employeeForm = this.fb.group(
      {
        id: [null],
        names: [null],
        snames: [null],
        username: [null],
        password: [null],
        specialtyId: [null],
        checkRolsArray: this.fb.array([]),
        checkServicesArray: this.fb.array([]),
        infoCheck: [null],
        available: [null]
      }
    );

    this.employeeForm.enable();

    if (+this.employeeId > 0) {
      this.initDataFilter();
    }
    else {
      this.employeeId = "0";
      this.checkRolDefault();
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
      this.adminService.getEmployee(this.employeeId)
    ]
    this.dataSubscription = forkJoin(sources)
      .subscribe(
        ([empleado]: [User]) => {
          this.empleado = empleado;

          if (this.employeeForm)
            this.initFormEmployee();

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

  onCheckboxRolesChange(e, name: string) {

    const checkRolsArray: FormArray = this.employeeForm.get('checkRolsArray') as FormArray;

    if (e.target.checked) {
      // Limpiando el chequeado antes
      let i: number = 0;
      checkRolsArray.controls.forEach((item: FormControl) => {
        checkRolsArray.removeAt(i);
        i++;
      });
      //Adicionando el nuevo
      checkRolsArray.push(new FormControl(e.target.value));

      this.currentRol = name;
    }
    else {
      // Limpiando el chequeado 
      let i: number = 0;
      checkRolsArray.controls.forEach((item: FormControl) => {
        checkRolsArray.removeAt(i);
        i++;
      });

      // let i: number = 0;
      // checkRolsArray.controls.forEach((item: FormControl) => {
      //   if (item.value == e.target.value) {
      //     checkRolsArray.removeAt(i);
      //     return;
      //   }
      //   i++;
      // });
    }
  }

  onCheckboxServicesChange(e) {

    const checkServicesArray: FormArray = this.employeeForm.get('checkServicesArray') as FormArray;

    if (e.target.checked) {
      checkServicesArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkServicesArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkServicesArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onCheckboxAcceptChange(e) {

    this.creating = e.target.checked;
  }

  buildCheckRoles(): any[] {
    var rolsIds: any[] = [];

    const checkRolsArray: FormArray = this.employeeForm.get('checkRolsArray') as FormArray;
    checkRolsArray.controls.forEach((item: FormControl) => {
      rolsIds.push({ id: +item.value });
    });

    return rolsIds;
  }

  buildCheckServices(): any[] {
    var servicesIds: any[] = [];

    //si el empleado no selecciono el rol especialista y se ignoran los servicios
    if (this.currentRol == 'Specialist') {
      if (!(this.employeeForm.get('specialtyId').value == null || this.employeeForm.get('specialtyId').value == 'null'
        || this.employeeForm.get('specialtyId').value == 0)) {
        const checkServicesArray: FormArray = this.employeeForm.get('checkServicesArray') as FormArray;
        checkServicesArray.controls.forEach((item: FormControl) => {
          servicesIds.push({ id: +item.value });
        });
      }
    }

    return servicesIds;
  }

  get disabled(): boolean {
    return false; //!this.selectedLaboratory;
  }

  IsRolChecked(id: number): boolean {

    const checkRolsArray: FormArray = this.employeeForm.get('checkRolsArray') as FormArray;

    var found: boolean = false;
    checkRolsArray.controls.forEach((item: FormControl) => {
      if (+item.value == id) {
        found = true;
      }
    });

    return found;
  }

  IsServiceChecked(id: number): boolean {

    const checkServicesArray: FormArray = this.employeeForm.get('checkServicesArray') as FormArray;

    var found: boolean = false;
    checkServicesArray.controls.forEach((item: FormControl) => {
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

    var rolsIds = this.buildCheckRoles();
    var servicesIds = this.buildCheckServices();

    this.empleado =
    {
      id: this.employeeForm.get('id').value,
      nombres: this.employeeForm.get('names').value,
      apellidos: this.employeeForm.get('snames').value,
      nombreUsuario: this.employeeForm.get('username').value,
      contrasenna: this.employeeForm.get('password').value,
      foto: (this.imageChange) ? this.imageToSend : this.imageRecovery,
      tokenNotificacion: null,
      tokenNotificacionExterno: null,
      disponible: this.employeeForm.get('available').value ? "1" : "0",
      roles: rolsIds,
      servicios: servicesIds,
      especialidades: null
    };

    //actualizar
    this.dataSubscription = this.adminService.updateEmployee(this.empleado)
      .subscribe(
        (data: any) => {
          this.empleado.id = data.id;
          this.updateSpeciality();
        },
        (error: HttpErrorResponse) => {

          this.notifyUpdateError(error);

          this.creating = false;

          this.updateData = false;
        }
      )
  }

  updateSpeciality() {

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    var operacion = "";
    //actualizar speciality
    var specialtyId = this.employeeForm.get('specialtyId').value !== 'null' ? +this.employeeForm.get('specialtyId').value : 0;

    //si el empleado no selecciono el rol especialista y tenia una especialidad esta se elimina
    if (this.currentRol != 'Specialist') {
      //Marca para simular que no se ha seleccionado ninguna
      specialtyId = 0;
    }

    //si el empleado no tenia especialidades y no marco ninguna no hago nada
    if (this.employeeSpecialty === 0) {
      if (specialtyId === 0)
        operacion = "nada";
      else
        operacion = "add";
    }
    else {
      //si el empleado si tenia especialidades y no marco ninguna borrar la que tenia 
      //si marco y es la misma no hacer nada sino adicionarla
      if (specialtyId === 0)
        operacion = "remove";
      else {
        if (specialtyId === this.employeeSpecialty)
          operacion = "nada";
        else
          operacion = "add";
      }
    }

    if (operacion !== "nada") {
      var specialist: Specialist =
      {
        empleadoId: this.empleado.id,
        especialidades: []
      };
      if (operacion == "add") {

        // si tenia una anterior debo borrarla antes de insertar la nueva
        if (this.employeeSpecialty !== 0) {
          // elimino la que tenia anteriormente
          specialist.especialidades.push(this.employeeSpecialty);

          this.dataSubscription = this.adminService.removeEmployeeSpecialities(specialist)
            .subscribe(
              (data: any) => {
                this.AddNewEsp(specialtyId);
              },
              (error: HttpErrorResponse) => {
                this.updateData = false;
                this.activeModal.close({ confirmed: true });
              }
            );
        }
        else {

          // adiciono la marcada
          this.AddNewEsp(specialtyId);
        }
      }
      else {
        // elimino la que tenia anteriormente
        specialist.especialidades.push(this.employeeSpecialty);

        this.dataSubscription = this.adminService.removeEmployeeSpecialities(specialist)
          .subscribe(
            (data: any) => {
              this.updateData = false;
              this.activeModal.close({ confirmed: true });
            },
            (error: HttpErrorResponse) => {
              this.updateData = false;
              this.activeModal.close({ confirmed: true });
            }
          );
      }
    }
    else {
      this.updateData = false;
      this.activeModal.close({ confirmed: true });
    }
  }

  cancelUpdate() {
    this.activeModal.close({ confirmed: false });
  }

  private initFormEmployee() {

    this.employeeForm.get('id').setValue(this.empleado.id);
    this.employeeForm.get('names').setValue(this.empleado.nombres);
    this.employeeForm.get('snames').setValue(this.empleado.apellidos);
    this.employeeForm.get('username').setValue(this.empleado.nombreUsuario);
    this.employeeForm.get('password').setValue(null);
    this.employeeForm.get('available').setValue((this.empleado.disponible && this.empleado.disponible === "1") ? true : false);

    if (this.empleado.foto != null) {
      this.imageToSend = this.empleado.foto;
      this. imageRecovery = this.imageToSend;
      this.imageToShow = 'data:image/' + 'png' + ';base64,' + this.empleado.foto;
    }

    this.initCheckboxRolesChange();
    this.initCheckboxServicesChange();

    this.employeeSpecialty = (this.empleado.especialidades && this.empleado.especialidades.length > 0)
      ? +this.empleado.especialidades[0].id : 0;
    this.employeeForm.get('specialtyId').setValue(this.employeeSpecialty);
  }

  initCheckboxRolesChange() {

    if (this.empleado && this.empleado.roles && this.empleado.roles.length > 0) {
      const checkRolsArray: FormArray = this.employeeForm.get('checkRolsArray') as FormArray;

      // this.empleado.roles.forEach((item: Role) => {
      //   checkRolsArray.push(new FormControl(item.id));
      // });

      //Solo poniendo el primer rol
      checkRolsArray.push(new FormControl(this.empleado.roles[0].id));

      this.currentRol = this.empleado.roles[0].nombre;
    }
  }

  initCheckboxServicesChange() {

    if (this.empleado && this.empleado.especialidades && this.empleado.especialidades.length > 0
      && this.empleado.servicios && this.empleado.servicios.length > 0) {
      const checkServicesArray: FormArray = this.employeeForm.get('checkServicesArray') as FormArray;

      this.empleado.servicios.forEach((item: Servicio) => {
        checkServicesArray.push(new FormControl(item.id));
      });
    }
  }

  private notifyUpdateError(error: any) {
    this.messageService.wrongOperation(error.error.message);
  }

  ChangeImage(event) {
    console.log("imagen "+event);
    if (event != null) {
      this.imageToSend = event;
      this.imageToShow = 'data:image/' + 'png' + ';base64,' + event;
      this.imageChange = true;
    }
    else {
      this.imageToSend = null;
      this.imageToShow = null;
      this.imageChange = true;
    }
  }

  CheckEspeciality() {
    if (this.employeeForm && this.employeeForm != null) {
      return (this.employeeForm.get('specialtyId').value == null || this.employeeForm.get('specialtyId').value == 'null'
        || this.employeeForm.get('specialtyId').value == 0 || this.currentRol != 'Specialist') ? true : false;
    }
    return false;
  }

  CheckRolEsp() {
    if (this.employeeForm && this.employeeForm != null) {
      return (this.currentRol != 'Specialist') ? true : false;
    }
    return false;
  }

  checkRolDefault() {

    const checkRolsArray: FormArray = this.employeeForm.get('checkRolsArray') as FormArray;

    //Solo poniendo el primer rol
    checkRolsArray.push(new FormControl(this.rolesRegistrados[0].id));

    this.currentRol = this.rolesRegistrados[0].nombre;
  }

  AddNewEsp(specialtyId: any)
  {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    // adiciono la marcada
    var specialist: Specialist =
    {
      empleadoId: this.empleado.id,
      especialidades: []
    };
    specialist.especialidades.push(specialtyId);
    this.dataSubscription = this.adminService.addEmployeeSpecialities(specialist)
      .subscribe(
        (data2: any) => {
          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {
          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        }
      );
  }

}
