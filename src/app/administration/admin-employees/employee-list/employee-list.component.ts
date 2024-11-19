import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faPenSquare, faCog, faFilter, faEraser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription, forkJoin, from } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';

import { AdminUsersService } from 'src/app/services/admin-users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import Swal from 'sweetalert'
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {


  loadingData: boolean;
  errorLoadingData: boolean;

  dataSubscription: Subscription;

  isCollapsed: boolean = false;

  faPlusSquareIcon = faPlusSquare;
  faPenSquareIcon = faPenSquare;
  faCogIcon = faCog;
  faFilterIcon = faFilter;
  faEraserIcon = faEraser;
  faTimesIcon = faTimes;
  faEye = faEye;
  faEdit=faEdit;
  faPlusCircle=faPlusCircle;
  faSearch=faSearch;

  private filterText = '';

  roles: any[];

  especialidades: any[];

  servicios: any[];

  items: any[];

  findRole: string = 'null';

  findSpecialty: string = 'null';

  currentLang: string;
  langSubscription: Subscription;

  loadingEmployees: boolean;
  errorLoadingEmployees: boolean;
  employeesSubscription: Subscription;

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedEmployee: any;

  itemsPerPage = 5;
  currentPage = 0;
  totalItems = 0;
  totalPages: number = 1;

  modalSubscription: Subscription;

  currentFilter: any;

  constructor(private translateService: TranslateService, private messageService: MessageService,
    private adminService: AdminUsersService, private modalService: NgbModal, private userPreferences: UserPreferencesService) { }

    ngOnInit() {
    this.itemsPerPage = this.userPreferences.getItemsPerPage();
    this.hookLang();
    this.initSelectionStatus();
    this.initDataFilter();
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    if (this.employeesSubscription) {
      this.employeesSubscription.unsubscribe();
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  FilterAction(actionId: string) {
    switch (actionId) {
      case 'filter':
        this.InitFilter();
        break;
      case 'clean':
        this.findRole = null;
        this.findSpecialty = null;
        this.filterText = "";
        break;
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
      this.adminService.getRegisteredRoles(),
      this.adminService.getRegisteredSpecialties(),
      this.adminService.getRegisteredServices()
    ]
    this.dataSubscription = forkJoin(sources)
      .subscribe(
        ([roles, especialidades, servicios]: any[]) => {
          this.roles = roles;
          this.especialidades = especialidades;
          this.servicios = servicios;

          this.InitFilter();

          this.loadingData = false;
        },
        (error: HttpErrorResponse) => {
          this.loadingData = false;
          this.errorLoadingData = true;

          console.log("error: HttpErrorResponse")
          console.log(error)
          
          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        });

  }

  onSelect(index) {
    this.initSelectionStatus();
    this.selectionState[index] = true;
    this.selectedEmployee = this.items[index];
    this.selectedIndex = index;
  }

  private initSelectionStatus() {
    this.selectionState = {};
    if (this.items) {
      this.items.forEach((item: any, index: number) => {
        this.selectionState[index] = false;
      });
    }
  }

  private getFilterEmployees(page: number) {

    if (this.employeesSubscription) {
      this.employeesSubscription.unsubscribe();
    }
    
    this.loadingEmployees = true;
    this.errorLoadingEmployees = false;

    this.employeesSubscription = this.adminService.getFilterEmployees(this.currentFilter.filterText, this.currentFilter.filterAvailable,
      +this.currentFilter.rolId, +this.currentFilter.specialtyId, this.currentFilter.filterProperty, null, page, this.itemsPerPage)
      .subscribe(
        (response: { total: number, employees: User[] }) => {
          this.items = response.employees.slice();
          this.items = this.items.map(
            pkt => {

              let rol = "";
              let especialidad = "";

              //roles
              if (+this.currentFilter.rolId > 0) {
                const coder = pkt.roles.find(role => role.id == +this.currentFilter.rolId);
                rol = coder ? coder.nombre : "";
              }
              else if (pkt.roles != null && pkt.roles.length > 0) {
                rol = pkt.roles[0].nombre;
              }

              //especialidades
              if (+this.currentFilter.specialtyId > 0) {
                const coder = pkt.especialidades.find(esp => esp.id == +this.currentFilter.specialtyId);
                especialidad = coder ? coder.nombre : "";
              }
              else if (pkt.especialidades != null && pkt.especialidades.length > 0) {
                especialidad = pkt.especialidades[0].nombre;
              }
              return {
                ...pkt,
                rol: rol,
                especialidad: especialidad,
              };
            });
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingEmployees = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total/ this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingEmployees = false;
          this.errorLoadingEmployees = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterEmployees(page)
  }

  AddEmployee() {

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(EmployeeEditComponent, { size: 'lg', centered: true });
    (<EmployeeEditComponent>modalRef.componentInstance).rolesRegistrados = this.roles;
    (<EmployeeEditComponent>modalRef.componentInstance).especialidadesRegistradas = this.especialidades;
    (<EmployeeEditComponent>modalRef.componentInstance).serviciosRegistrados = this.servicios;
    (<EmployeeEditComponent>modalRef.componentInstance).employeeId = "0";
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean } ) =>
      {
        if (response.confirmed)
        {
          this.notifyUpdateSuccess();
          this.getFilterEmployees(this.currentPage);
        }
      }
    );
  }

  EditEmployee() {

    if(!this.selectedEmployee)
    {
      var message: string = this.currentLang == "es" ? "Seleccione el empleado." : "Select employee.";
      this.messageService.generalMessage(false, message);
      return;
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
    
    const modalRef = this.modalService.open(EmployeeEditComponent, { size: 'lg', centered: true });
    (<EmployeeEditComponent>modalRef.componentInstance).rolesRegistrados = this.roles;
    (<EmployeeEditComponent>modalRef.componentInstance).especialidadesRegistradas = this.especialidades;
    (<EmployeeEditComponent>modalRef.componentInstance).serviciosRegistrados = this.servicios;
    (<EmployeeEditComponent>modalRef.componentInstance).employeeId = this.selectedEmployee.id;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) =>
      {
        if (response.confirmed)
        {
          this.notifyUpdateSuccess();
          this.getFilterEmployees(this.currentPage);
        }
      }
    );

  }
  private notifyUpdateSuccess() {
    this.messageService.correctOperation();
  }

  private InitFilter()
  {
    this.currentFilter = {
      filterText: this.filterText != null && this.filterText != "null" ? this.filterText : "",
      filterAvailable: "",
      rolId: this.findRole !== 'null' ? this.findRole : '0',
      specialtyId: this.findSpecialty !== 'null' ? this.findSpecialty : '0',
      filterProperty: ""
    };

    this.getFilterEmployees(0);
  }

  RemoveEmployee() {

    Swal({
      title:  this.currentLang == "es" ? "¿Está seguro?" : "Are you sure?",
      text: this.currentLang == "es" ? "Una vez borrado el empleado no se podrá recuperar." : "Once deleted, you will not be able to recover this emproyee!",
      icon: "warning",
      buttons:{cancel:true,confirm:true},
      dangerMode:true,
    })
    .then((willDelete) => {
      if (willDelete) {
        if(!this.selectedEmployee)
    {
      var message: string = this.currentLang == "es" ? "Seleccione el empleado." : "Select employee.";
      this.messageService.generalMessage(false, message);
      return;
    }

    if (this.employeesSubscription) {
      this.employeesSubscription.unsubscribe();
    }

    this.employeesSubscription = this.adminService.deleteEmployee(this.selectedEmployee.id)
      .subscribe(
        (response: { result: boolean }) => {
          if (response.result) {
            Swal(this.currentLang == "es" ? "El empleado ha sido borrado." :"The employee has been deleted!", {
              icon: "success",
            });
            this.notifyUpdateSuccess();
            this.getFilterEmployees(this.currentPage);
          }
        },
        (error: HttpErrorResponse) => {

          console.log("error: HttpErrorResponse")
          console.log(error)

          this.messageService.wrongOperation(error.error.message);
        }
      );
        
      } 
    });
    

   
  }
}
