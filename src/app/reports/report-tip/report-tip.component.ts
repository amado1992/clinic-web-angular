import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faSearch, faPlusCircle, faEdit, faEye, faPlusSquare, faCog, faFilter, faEraser, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription, forkJoin, from } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { DatePipe } from '@angular/common';
import { Asistencia } from 'src/app/models/asistencia.model';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-report-tip',
  templateUrl: './report-tip.component.html',
  styleUrls: ['./report-tip.component.scss']
})
export class ReportTipComponent implements OnInit {

  loadingData: boolean;
  errorLoadingData: boolean;
  loadingDataEmployee: boolean;
  errorLoadingDataEmployee: boolean;

  loadingDataLanguage: boolean = true;
  errorLoadingDataLanguage: boolean;

  dataSubscription: Subscription;

  isCollapsed: boolean = false;

  faCogIcon = faCog;
  faFilterIcon = faFilter;
  faEraserIcon = faEraser;
  faPlusSquareIcon = faPlusSquare;
  faCloseIcon = faTimes;
  faArrowRightIcon = faArrowRight;
  faEye = faEye;
  faEdit = faEdit;
  faPlusCircle = faPlusCircle;
  faSearch = faSearch;

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
  reportResult: any = ""
  today = Date.now()
  fechaIni: any;
  fechaFin: any;
  formats = [{ title: "PDF", value: 0 }, { title: "HTML", value: 1 }, { title: "EXCEL", value: 2 }]
  format: any = 1
  employee: any = null
  body: any = {
    id: 0,
    format: 1,
    parameters: {
      fecha_inicio: "",
      empleado: null,
      fecha_fin: ""
    }
  }
  listReports: any[] = [];
  urlElement: any
  cleanText: any = ""
  maxDate: any
  listemployees: any[] = [];
  listEmployeesResult: any[] = [];
  executeMethod = false

  constructor(private translateService: TranslateService, private messageService: MessageService,
    private adminService: AdminUsersService, private modalService: NgbModal, private datePipe: DatePipe,
    private userPreferences: UserPreferencesService, private _sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.hookLang();
    var message: string = this.currentLang == "es" ? "Vacío" : "Empty";
    if (this.employee == null) {
      this.employee = message
    }

    this.initDateFilter();
    this.initDataFilter();
    this.employees()
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
        this.executeReport();
        break;
      case 'clean':
        this.CleanFilters();
        break;
    }
  }

  hookLang() {
    this.loadingDataLanguage = true
    this.errorLoadingDataLanguage = false

    this.currentLang = this.translateService.currentLang;
    this.langSubscription = this.translateService.onLangChange
      .subscribe(
        (langChange: LangChangeEvent) => {
          this.currentLang = langChange.lang;

          this.loadingDataLanguage = false;
        }
      );
  }

  private initDataFilter() {
    this.getListReports();

  }

  getListReports() {

    if (this.assistancesSubscription) {
      this.assistancesSubscription.unsubscribe();
    }

    this.loadingData = true;
    this.errorLoadingData = false;

    this.assistancesSubscription = this.adminService.getReports()
      .subscribe(
        (response) => {

          this.listReports = response
          this.loadingData = false;
          this.executeReport()
        },
        (error: HttpErrorResponse) => {
          this.loadingData = false;
          this.errorLoadingData = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getListReports()
  }

  CleanFilters() {
    this.selectEspecialista = null;

    if (this.currentLang == "en") {
      this.employee = "Empty";
    } else {
      this.employee = "Vacío";
    }
    /*this.fechaIni = null;
    this.fechaFin = null;*/
    this.format = 1;
    this.loadingAssistances = false;
    this.errorLoadingAssistances = true;
    this.executeMethod = false
    this.initDateFilter();
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
    this.maxDate = this.datePipe.transform(beginDate, 'yyyy-MM-dd')

    beginDate.setMonth(beginDate.getMonth() + 1);
    beginDate.setDate(beginDate.getDate() - 30);

    this.fechaIni = `${beginDate.getFullYear()}-${beginDate.getMonth() < 10 ? '0' + beginDate.getMonth() : beginDate.getMonth()}-${beginDate.getDate() < 10 ? '0' + beginDate.getDate() : beginDate.getDate()}`;

    const currentDate = new Date();

    this.fechaFin = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}-${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}`;

  }

  executeReport() {
    this.loadingAssistances = true;
    this.errorLoadingAssistances = false;
    this.executeMethod = false

    var entry = this.listReports.find(val => val.idioma == this.currentLang && (val.nombre == "ReportePropinas" || val.nombre == "TipReport"))

    this.fechaIni = this.datePipe.transform(this.fechaIni, 'yyyy-MM-dd')
    this.fechaFin = this.datePipe.transform(this.fechaFin, 'yyyy-MM-dd')

    this.body.parameters.fecha_inicio = this.fechaIni//Example: "2022-09-09"
    this.body.parameters.fecha_fin = this.fechaFin

    if (this.employee == "Vacío" || this.employee == "Empty") {
      //this.employee = ""
      this.body.parameters.empleado = null
    } else {
      this.body.parameters.empleado = JSON.parse(this.employee)
    }

    if (entry != undefined) {
      this.body.id = entry.id
    } else { this.body.id = 0 }
    this.body.format = JSON.parse(this.format)


    if (this.format > -1 && this.body.id > 0) {
      this.adminService.executeReport(this.body).subscribe(res => {
        this.loadingAssistances = false;
        // Decode the String
        var decodedString = atob(res.executionResult);
        this.reportResult = decodedString
        this.cleanText = this.transform(this.reportResult);
        this.executeMethod = true

        /*const bytes = new Uint8Array(decodedString.length);
        const binaryToBlob = bytes.map((byte, i) => decodedString.charCodeAt(i));*/
        //const blob = new Blob([binaryToBlob], { type: '*/*' })
        /*const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Report");
        document.body.appendChild(link);
        link.click();*/
      }, (error: HttpErrorResponse) => {
        this.loadingAssistances = false;
        this.errorLoadingAssistances = true;
        this.executeMethod = false
        console.error(error)
        var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
        this.messageService.generalMessage(false, message);
      })
    }
    if (this.format < 0) {
      this.loadingAssistances = false;
      var message: string = this.currentLang == "es" ? "Seleccione un formato." : "Select a format.";
      this.messageService.generalMessage(false, message);
    }
    if (this.body.id == 0) {
      this.loadingAssistances = false;
    }

  }
  oldDownload() {
    if (this.reportResult != "") {
      var decodedString = this.reportResult
      const bytes = new Uint8Array(decodedString.length);
      const binaryToBlob = bytes.map((byte, i) => decodedString.charCodeAt(i));
      const blob = new Blob([binaryToBlob], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Report.pdf");
      document.body.appendChild(link);
      link.click();
    } else {
      var message: string = this.currentLang == "es" ? "No existe un reporte para descargar." : "There is no report to download.";
      this.messageService.generalMessage(false, message);
    }
  }

  download() {
    if (this.reportResult != "") {

      var decodedString = this.reportResult
      const bytes = new Uint8Array(decodedString.length);
      const binaryToBlob = bytes.map((byte, i) => decodedString.charCodeAt(i));
      var blob

      if (this.format == 0) {
        blob = new Blob([binaryToBlob], { type: 'application/pdf' })
      }

      if (this.format == 2) {
        blob = new Blob([binaryToBlob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' })
      }

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;

      if (this.format == 0) {
        link.setAttribute("download", "Report.pdf");
      }

      if (this.format == 2) {
        link.setAttribute("download", "Report.xlsx");
      }

      document.body.appendChild(link);
      link.click();
    } else {
      var message: string = this.currentLang == "es" ? "No existe un reporte para descargar." : "There is no report to download.";
      this.messageService.generalMessage(false, message);
    }
  }

  transform(value: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }

  modelChangeFn(value) {
    this.reportResult = ""
    this.cleanText = ""
    this.executeMethod = false
  }

  modelChangeemployee(value) {
    this.reportResult = ""
    this.cleanText = ""
    this.executeMethod = false
  }

  employees() {
    this.loadingDataEmployee = true;
    this.errorLoadingDataEmployee = false;
    this.adminService.getRegisteredEmployees().subscribe(
      (response) => {
        this.listEmployeesResult = response
        for (let entry of this.listEmployeesResult) {
          var employee = entry.especialidades.find(val => val.nombre == "Massage therapist")
          if (employee != undefined) {
            this.listemployees.push(entry)
          }
        }
        this.loadingDataEmployee = false;
      },
      (error: HttpErrorResponse) => {
        this.loadingDataEmployee = false;
        this.errorLoadingDataEmployee = true;

        console.log("error: HttpErrorResponse")
        console.log(error)

        var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
        this.messageService.generalMessage(false, message);
      }
    )
  }

  handlerDateStart(e) {
    this.reportResult = ""
    this.cleanText = ""
    this.executeMethod = false
  }

  handlerDateEnd(e) {
    this.reportResult = ""
    this.cleanText = ""
    this.executeMethod = false
  }

}
