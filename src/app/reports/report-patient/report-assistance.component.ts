import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { faPlusSquare, faCog, faFilter, faEraser, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';
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
  templateUrl: './report-patient.component.html',
  styleUrls: ['./report-patient.component.scss']
})
export class ReportPatientComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;
  faFilterIcon = faFilter;
  faEraserIcon = faEraser;
  faPlusSquareIcon = faPlusSquare;
  faCloseIcon = faTimes;
  faArrowRightIcon = faArrowRight;

  constructor(private translateService: TranslateService, private messageService: MessageService,
    private adminService: AdminUsersService, private modalService: NgbModal, private datePipe: DatePipe,
    private userPreferences: UserPreferencesService) { }

  ngOnInit() {

  }

  ngOnDestroy() {


  }

}
