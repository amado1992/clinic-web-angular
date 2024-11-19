import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { faSearch,faPlusCircle,faEdit,faEye,faCog, faFilter, faEraser } from '@fortawesome/free-solid-svg-icons';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription, forkJoin, from } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';

import { AdminUsersService } from 'src/app/services/admin-users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { CitaAux } from 'src/app/models/citaAux.model';
import { DatePipe } from '@angular/common';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dates',
  templateUrl: './admin-dates.component.html',
  styleUrls: ['./admin-dates.component.scss']
})
export class AdminDatesComponent implements OnInit, OnDestroy {


  loadingData: boolean;
  errorLoadingData: boolean;

  dataSubscription: Subscription;

  isCollapsed: boolean = false;

  faCogIcon = faCog;
  faFilterIcon = faFilter;
  faEraserIcon = faEraser;
  faEye = faEye;
  faEdit=faEdit;
  faPlusCircle=faPlusCircle;
  faSearch=faSearch;
  ramas: any[];

  especialistas: any[];

  salas: any[];

  pacientes: any[];

  items: any[];

  selectRama: string = 'null';

  selectEspecialista: string = 'null';

  selectSala: string = 'null';

  private filterText = '';

  fechaIni: any

  findFinish: string = 'null';

  currentLang: string;
  langSubscription: Subscription;

  loadingCitations: boolean;
  errorLoadingCitations: boolean;
  citationsSubscription: Subscription;

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedCitation: any;

  itemsPerPage = 5;
  currentPage = 0;
  totalItems = 0;
  totalPages: number = 1;

  currentFilter:any;

  constructor(private translateService: TranslateService, private messageService: MessageService, private datePipe: DatePipe,
    private adminService: AdminUsersService, private modalService: NgbModal, private userPreferences: UserPreferencesService) { }

  ngOnInit() {
    this.initDateFilter();
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

    if (this.citationsSubscription) {
      this.citationsSubscription.unsubscribe();
    }

  }

  FilterAction(actionId: string) {
    switch (actionId) {
      case 'filter':
        if (this.fechaIni != null && this.fechaIni != "" && this.fechaIni != "<empty string>")
          this.InitFilter();
        else {
          var message: string = this.currentLang == "es" ? "Fecha requerida" : "Date required";
          this.messageService.generalMessage(false, message);
        }
        break;
      case 'clean':
        this.selectRama = null;
        this.selectEspecialista = null;
        this.selectSala = null;
        this.filterText = "";
        this.findFinish = null;
        this.initDateFilter();
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

    var initFilter =
    {
      fechaIni: this.BuildDate(this.fechaIni, false),
      fechaFin: this.BuildDate(this.fechaIni, true),
    };

    const sources = [
      this.adminService.getRegisteredBranchs(),
      this.adminService.getFilterEmployeesBySpecialities(0),
      this.adminService.getRegisteredRooms(),
      this.adminService.getPatientsCitationByDate(initFilter)

    ]
    this.dataSubscription = forkJoin(sources)
      .subscribe(
        ([ramas, especialistas, salas, pacientes]: any[]) => {
          this.ramas = ramas;
          this.especialistas = especialistas.employees;
          this.salas = salas;
          this.pacientes = pacientes;

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
    this.selectedCitation = this.items[index];
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

  private getFilterCitations(page: number) {

    if (this.citationsSubscription) {
      this.citationsSubscription.unsubscribe();
    }

    this.loadingCitations = true;
    this.errorLoadingCitations = false;

    this.currentFilter.pageFindData.page = page;
    console.log(this.currentFilter);
    this.citationsSubscription = this.adminService.getFilterCitations(this.currentFilter)
      .subscribe(
        (response: { total: number, citations: CitaAux[] }) => {
          this.items = response.citations.slice();
          this.items = this.items.map(
            pkt => {

              var sala: any = null;
              var especialista: any = null;
              var hora = this.datePipe.transform(pkt.cita.fechaCreacion.toString(), 'HH:mm');

              var estado_cita_rama_quiro = 0;
              var estado_cita_rama_mo = 0;

              if (pkt.cita.empleados != null && pkt.cita.empleados.length > 0)
              {
                var current_employee = pkt.cita.empleados[0];

                var especialidad = "";
                if (current_employee.especialidades && current_employee.especialidades.length > 0)
                {
                  especialidad = current_employee.especialidades[0].nombre;
                }

                especialista =
                {
                  nombres: current_employee.nombres,
                  apellidos: current_employee.apellidos,
                  especialidad: especialidad
                };
              }

              pkt.cita.ramas.forEach(current_rama => {
                if (current_rama.id == 1) {
                  estado_cita_rama_mo = 1;
                  //Medicina oriental
                  if (pkt.cita.ramasTerminadas && pkt.cita.ramasTerminadas.length > 0) {
                    if (pkt.cita.ramasTerminadas.indexOf(1) >= 0)
                      estado_cita_rama_mo = 2;
                  }
                }
                else if (current_rama.id == 2) {
                  estado_cita_rama_quiro = 1;
                  //Quiropraxis
                  if (pkt.cita.ramasTerminadas && pkt.cita.ramasTerminadas.length > 0) {
                    if (pkt.cita.ramasTerminadas.indexOf(2) >= 0)
                      estado_cita_rama_quiro = 2;
                  }
                }

              });

              var servicios_quiro: any[] = [];
              var servicios_mo: any[] = [];

              if (pkt.cita.tratamientos != null) 
              {
                for(var i=0; i< pkt.cita.tratamientos.length; i++)
                {
                  var current_treatment = pkt.cita.tratamientos[i];

                  if (current_treatment.sala != null)
                    sala = current_treatment.sala;

                  if (current_treatment.empleado != null) 
                  {
                    var especialidad = "";
                    if (current_treatment.empleado.especialidades && current_treatment.empleado.especialidades.length > 0) {
                        especialidad = current_treatment.empleado.especialidades[0].nombre;
                    }
                    especialista =
                    {
                      nombres: current_treatment.empleado.nombres,
                      apellidos: current_treatment.empleado.apellidos,
                      especialidad: especialidad
                    };
                  }

                  if (current_treatment.servicio != null && current_treatment.servicio.rama != null) {

                    var serv =
                    {
                      nombre: current_treatment.servicio.nombre,
                      color: current_treatment.servicio.color ? current_treatment.servicio.color : "#dee2e6",
                      tiempo: current_treatment.fechaTerminacion ? this.BuildTime(current_treatment.tiempoReal) :
                      this.datePipe.transform(pkt.cita.fechaCreacion.toString(), 'HH:mm'),
                      terminado: current_treatment.fechaTerminacion ? true : false
                    };
                    if (current_treatment.servicio.rama.id == 1) {
                      //Medicina Oriental

                      servicios_mo.push(serv);
                    }
                    else if (current_treatment.servicio.rama.id == 2) {
                      //Quiropraxis
                      servicios_quiro.push(serv);
                    }
                  }
                }
              }

              return {
                paciente: pkt.cita.paciente,
                sala: sala,
                especialista: especialista,
                hora: hora,
                servicios_mo: { estado: estado_cita_rama_mo, servicios: servicios_mo },
                servicios_quiro: { estado: estado_cita_rama_quiro, servicios: servicios_quiro }
              };
            });
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingCitations = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total / this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingCitations = false;
          this.errorLoadingCitations = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterCitations(page)
  }

  BuildDate(currentDate: Date, end: boolean): Date {
    if (!currentDate || currentDate.toString() == "")
      return null;
    else {
      var newDate = new Date(currentDate);

      newDate.setDate(newDate.getDate() + 1);
      if (!end)
        newDate.setHours(0, 0, 0, 0);
      else
        newDate.setHours(23, 59, 59, 0);

      return newDate;
    }
  }

  private initDateFilter() {

    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() + 1)

    this.fechaIni = `${beginDate.getFullYear()}-${beginDate.getMonth() < 10 ? '0' + beginDate.getMonth() : beginDate.getMonth()}-${beginDate.getDate() < 10 ? '0' + beginDate.getDate() : beginDate.getDate()}`;
  }

  BuildEmployees(): number[] {

    var employeesIds: number[] = [];

    if (this.selectEspecialista !== null && this.selectEspecialista !== 'null') {
      employeesIds.push(+this.selectEspecialista);
    }

    if (employeesIds.length > 0)
      return employeesIds;
    else
      return null;
  }

  BuildBranchs(): number[] {

    var branchsIds: number[] = [];

    if (this.selectRama !== null && this.selectRama !== 'null') {
      branchsIds.push(+this.selectRama);
    }

    if (branchsIds.length > 0)
      return branchsIds;
    else
      return null;
  }

  BuildTime(tiempoReal: any): string {
    var result: string = "";

    var split: string[] = tiempoReal.toString().split(':');
    var hora: number = +split[0];
    var min: number = +split[1];

    if (hora > 0)
      result += hora + " h"

    if (min > 0)
      result += min + " min"

    return result;
  }

  private InitFilter()
  {
    this.currentFilter =
    {
      citationFindData:
      {
        fechaCreacionIni: this.BuildDate(this.fechaIni, false),
        fechaCreacionFin: this.BuildDate(this.fechaIni, true),
        ramas: this.BuildBranchs(),
        empleados: this.BuildEmployees(),
        filterValue: this.filterText != null && this.filterText != "null" ? this.filterText : "",
        salaId: this.selectSala !== 'null' ? this.selectSala : 0,
        terminada: this.findFinish !== 'null' ? this.findFinish : ""
      },
      pageFindData: {

        order: 'asc',
        property: null,
        page: 0,
        size: this.itemsPerPage
      }
    };

    this.getFilterCitations(0);
  }
}
