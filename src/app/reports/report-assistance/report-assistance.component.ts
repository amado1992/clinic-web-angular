import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faCog, faFilter, faEraser, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription, forkJoin, from } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';

import { AdminUsersService } from 'src/app/services/admin-users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { DatePipe} from '@angular/common';
import { Asistencia } from 'src/app/models/asistencia.model';

@Component({
  selector: 'app-report-assistance',
  templateUrl: './report-assistance.component.html',
  styleUrls: ['./report-assistance.component.scss']
})
export class ReportAssistanceComponent implements OnInit, OnDestroy {

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

  items: any[];

  currentLang: string;
  langSubscription: Subscription;

  loadingAssistances: boolean;
  errorLoadingAssistances: boolean;
  assistancesSubscription: Subscription;

  itemsPerPage = 5;
  currentPage = 0;
  totalItems = 0;
  totalPages: number = 1;

  modalSubscription: Subscription;

  selectEspecialista: string = 'null';

  fechaIni: any;
  fechaFin: any;


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

    if (this.assistancesSubscription) {
      this.assistancesSubscription.unsubscribe();
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  FilterAction(actionId: string) {
    switch (actionId) {
      case 'filter':
        this.getFilterAssistances(0);
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
      this.adminService.getRegisteredEmployees()
    ]
    this.dataSubscription = forkJoin(sources)
      .subscribe(
        ([especialistas]: any[]) => {
          this.especialistas = especialistas;

          this.especialistas = this.especialistas.map(
            pkt => {
              return {
                ...pkt,
                seleccionado: false,
              };
            });

          this.getFilterAssistances(0);

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

  private getFilterAssistances(page: number) {

    if (this.assistancesSubscription) {
      this.assistancesSubscription.unsubscribe();
    }

    this.loadingAssistances = true;
    this.errorLoadingAssistances = false;

    var currentFilter =
    {
      assistanceFindData:
      {
        fechaIni: this.BuildDate(this.fechaIni, false),
        fechaFin: this.BuildDate(this.fechaFin, true),
        empleados: this.BuildEmployees()
      },
      pageFindData: {

        order: 'asc',
        property: null,
        page: page,
        size: this.itemsPerPage
      }
    };

    this.assistancesSubscription = this.adminService.getFilterRegisterAssistance(currentFilter)
      .subscribe(
        (response: { total: number, assistances: Asistencia[] }) => {
          this.items = response.assistances.slice();
          this.items = this.items.map(
            pkt => {

              let apellidosEspecialista = "";
              let fechaShortIni = "";
              let fechaShortFin = "";

              if (pkt.empleado)
              {
                apellidosEspecialista = pkt.empleado.apellidos;
              }

              if (pkt.fechaEntrada)
              {
                fechaShortIni = this.datePipe.transform(pkt.fechaEntrada.toString(), 'short');
              }

              if (pkt.fechaSalida)
              {
                fechaShortFin = this.datePipe.transform(pkt.fechaSalida.toString(), 'short');
              }

              return {
                ...pkt,
                apellidosEspecialista: apellidosEspecialista,
                fechaShortIni: fechaShortIni,
                fechaShortFin: fechaShortFin
              };
            });
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingAssistances = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total / this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingAssistances = false;
          this.errorLoadingAssistances = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterAssistances(page)
  }

  private SelectEmployee() {

    if (this.selectEspecialista && this.selectEspecialista != 'null') {
      var index = this.selectEspecialista.split(',')[0];
      var id = this.selectEspecialista.split(',')[1];

      this.especialistas[index].seleccionado = true;
      this.selectEspecialista = null;
    }
  }

  EnableEmployee(index) {
    return this.especialistas[index].seleccionado ? "none" : "";
  }

  RemoveEmployee(index) {
    return this.especialistas[index].seleccionado = false;
  }

  DisableEmployee(index) {
    return !this.especialistas[index].seleccionado ? "none" : "";
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
    this.fechaIni = null;
    this.fechaFin = null;
    this.especialistas.forEach((item => {
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

  private initDateFilter() {

    const beginDate = new Date();

    beginDate.setMonth(beginDate.getMonth() + 1);
    beginDate.setDate(beginDate.getDate() - 30);

    this.fechaIni = `${beginDate.getFullYear()}-${beginDate.getMonth() < 10 ? '0' + beginDate.getMonth() : beginDate.getMonth()}-${beginDate.getDate() < 10 ? '0' + beginDate.getDate() : beginDate.getDate()}`;
    
    const currentDate = new Date();

    this.fechaFin = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}-${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}`;

  }

}