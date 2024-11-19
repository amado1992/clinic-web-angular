import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faCog, faFilter, faEraser, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription, forkJoin, from } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';

import { AdminUsersService } from 'src/app/services/admin-users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { Tratamiento } from 'src/app/models/tratamiento.model';
import { DatePipe, Time } from '@angular/common';

@Component({
  selector: 'app-report-treatment',
  templateUrl: './report-treatment.component.html',
  styleUrls: ['./report-treatment.component.scss']
})
export class ReportTreatmentComponent implements OnInit, OnDestroy {


  loadingData: boolean;
  errorLoadingData: boolean;

  dataSubscription: Subscription;

  isCollapsed: boolean = false;

  faCogIcon = faCog;
  faFilterIcon = faFilter;
  faEraserIcon = faEraser;
  faPlusSquareIcon = faPlusSquare;
  faCloseIcon = faTimes;
  faArrowRightIcon = faArrowRight;
  faEye = faEye;
  faEdit=faEdit;
  faPlusCircle=faPlusCircle;
  faSearch=faSearch;

  especialistas: any[];

  servicios: any[];

  items: any[];

  currentLang: string;
  langSubscription: Subscription;

  loadingTreatments: boolean;
  errorLoadingTreatments: boolean;
  treatmentsSubscription: Subscription;

  itemsPerPage = 5;
  currentPage = 0;
  totalItems = 0;
  totalPages: number = 1;

  modalSubscription: Subscription;

  selectEspecialista: string = 'null';
  selectServicio: string = 'null';

  fechaIni: any;
  fechaFin: any;
  tiempoIni: any = null;
  tiempoFin: any = null;


  constructor(private translateService: TranslateService, private messageService: MessageService,
    private adminService: AdminUsersService, private modalService: NgbModal, private datePipe: DatePipe,
    private userPreferences: UserPreferencesService) { }

  ngOnInit() {
    this.initDateFilter();
    this.itemsPerPage = this.userPreferences.getItemsPerPage();
    this.hookLang();
    this.initDataFilter();
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    if (this.treatmentsSubscription) {
      this.treatmentsSubscription.unsubscribe();
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  FilterAction(actionId: string) {
    switch (actionId) {
      case 'filter':
        this.getFilterTreatments(0);
        break;
      case 'clean':
        this.CleanFilters();
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
      this.adminService.getRegisteredEmployees(),
      this.adminService.getRegisteredServices()
    ]
    this.dataSubscription = forkJoin(sources)
      .subscribe(
        ([especialistas, servicios]: any[]) => {
          this.especialistas = especialistas;
          this.servicios = servicios;

          this.especialistas = this.especialistas.map(
            pkt => {
              return {
                ...pkt,
                seleccionado: false,
              };
            });

          this.servicios = this.servicios.map(
            pkt => {
              return {
                ...pkt,
                seleccionado: false,
              };
            });

          this.getFilterTreatments(0);

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

  private getFilterTreatments(page: number) {

    if (this.treatmentsSubscription) {
      this.treatmentsSubscription.unsubscribe();
    }

    this.loadingTreatments = true;
    this.errorLoadingTreatments = false;

    var currentFilter =
    {
      reportFilterTreatmentFindData:
      {
        fechaIni: this.BuildDate(this.fechaIni, false),
        fechaFin: this.BuildDate(this.fechaFin, true),
        tiempoIni: this.BuildTime(this.tiempoIni),
        tiempoFin: this.BuildTime(this.tiempoFin),
        servicios: this.BuildServices(),
        empleados: this.BuildEmployees()
      },
      pageFindData: {

        order: 'asc',
        property: null,
        page: page,
        size: this.itemsPerPage
      }
    };

    this.treatmentsSubscription = this.adminService.getReportFilterTreatments(currentFilter)
      .subscribe(
        (response: { total: number, treatments: Tratamiento[] }) => {
          this.items = response.treatments.slice();
          this.items = this.items.map(
            pkt => {

              let nombreServicio = "";
              let nombreRama = "";
              let apellidosEspecialista = "";
              let fechaShort = "";
              let estimado = "";
              let real = "";
              let especialidad = "";

              if (pkt.servicio)
              {
                nombreServicio = pkt.servicio.nombre;
                nombreRama = pkt.servicio.rama.nombre;
              }

              if (pkt.empleado)
              {
                apellidosEspecialista = pkt.empleado.apellidos;

                if (pkt.empleado.especialidades && pkt.empleado.especialidades.length > 0) {
                  var especialidades = pkt.empleado.especialidades;
                  if (especialidades != null && especialidades.length > 0)
                    especialidad = especialidades[0].nombre;
                }
              }

              if (pkt.tiempoEstimado)
                estimado = this.BuildTimeTable(pkt.tiempoEstimado);

              if (pkt.tiempoReal)
                real = this.BuildTimeTable(pkt.tiempoReal);

              fechaShort = this.datePipe.transform(pkt.fechaCreacion.toString(), 'short');

              return {
                ...pkt,
                nombreServicio: nombreServicio,
                nombreRama: nombreRama,
                apellidosEspecialista: apellidosEspecialista,
                estimado: estimado,
                real: real,
                fechaShort: fechaShort,
                especialidad: especialidad
              };
            });
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingTreatments = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total / this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingTreatments = false;
          this.errorLoadingTreatments = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterTreatments(page)
  }

  private SelectEmployee() {

    if (this.selectEspecialista && this.selectEspecialista != 'null') {
      var index = this.selectEspecialista.split(',')[0];
      var id = this.selectEspecialista.split(',')[1];

      this.especialistas[index].seleccionado = true;
      this.selectEspecialista = null;
    }
  }

  private SelectService() {

    if (this.selectServicio && this.selectServicio != 'null') {
      var index = this.selectServicio.split(',')[0];
      var id = this.selectServicio.split(',')[1];

      this.servicios[index].seleccionado = true;
      this.selectServicio = null;
    }
  }

  EnableEmployee(index) {
    return this.especialistas[index].seleccionado ? "none" : "";
  }

  EnableService(index) {
    return this.servicios[index].seleccionado ? "none" : "";
  }

  RemoveEmployee(index) {
    return this.especialistas[index].seleccionado = false;
  }

  RemoveService(index) {
    return this.servicios[index].seleccionado = false;
  }

  DisableEmployee(index) {
    return !this.especialistas[index].seleccionado ? "none" : "";
  }

  DisableService(index) {
    return !this.servicios[index].seleccionado ? "none" : "";
  }

  BuildServices(): number[] {
    var servicesIds: number[] = [];
    this.servicios.forEach((item => {
      if (item.seleccionado) {
        servicesIds.push(item.id);
      }
    }));

    if (servicesIds.length > 0)
      return servicesIds;
    else
      return null;
  }

  BuildEmployees(): number[] {
    var employeesIds: number[] = [];
    this.especialistas.forEach((item => {
      if (item.seleccionado) {
        employeesIds.push(item.id);
      }
    }));

    if (employeesIds.length > 0)
      return employeesIds;
    else
      return null;
  }

  CleanFilters() {
    this.selectEspecialista = null;
    this.selectServicio = null;
    this.tiempoIni = "null";
    this.tiempoFin = "null";
    this.fechaIni = null;
    this.fechaFin = null;
    this.especialistas.forEach((item => {
      item.seleccionado = false;
    }));
    this.servicios.forEach((item => {
      item.seleccionado = false;
    }));
  }

  BuildDate(currentDate: Date, end: boolean): Date 
  {
    if (!currentDate || currentDate.toString() == "")
      return null;
    else 
    {
      var newDate = new Date(currentDate);

      newDate.setDate(newDate.getDate() + 1);
      if (!end) 
        newDate.setHours(0, 0, 0, 0);
      else
        newDate.setHours(23, 59, 59, 0);
        
      return newDate;
    }
  }

  BuildTime(currentTime: Time): any 
  {
    console.log("currentTime")
    console.log(currentTime)
    if (!currentTime || currentTime.toString() == "" || currentTime.toString() == "null")
      return null;
    else 
    {
      return currentTime + ":00"
    }
  }

  BuildTimeTable(currentTime: any): string
  {
    var result: string = "";

    var split:string[] = currentTime.toString().split(':');
    var hora: number = +split[0];
    var min: number = +split[1];

    if(hora > 0)
      result += hora +" h"

    if(min > 0)
      result += min +" min"

    return result;
  }

  private initDateFilter() {

    const beginDate = new Date();

    beginDate.setMonth(beginDate.getMonth() + 1);
    beginDate.setDate(beginDate.getDate() - 30);

    this.fechaIni = `${beginDate.getFullYear()}-${beginDate.getMonth() < 10 ? '0' + beginDate.getMonth() : beginDate.getMonth()}-${beginDate.getDate() < 10 ? '0' + beginDate.getDate() : beginDate.getDate()}`;
    
    const currentDate = new Date();

    this.fechaFin = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}-${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}`;

  }
}
