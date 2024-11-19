import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ClassificatorEditComponent } from '../classificator-edit/classificator-edit.component';
import { from, Subscription } from 'rxjs';
import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faPenSquare, faCog, faFilter, faEraser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { Clasificador } from 'src/app/models/clasificador.model';
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-classificator-list',
  templateUrl: './classificator-list.component.html',
  styleUrls: ['./classificator-list.component.scss']
})
export class ClassificatorListComponent implements OnInit, OnDestroy {

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

  currentLang: string;
  langSubscription: Subscription;

  loadingClassificators: boolean;
  errorLoadingClassificators: boolean;
  classificatorsSubscription: Subscription;

  items: any[];

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedClassificator: any;

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
    this.InitFilter();
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }

    if (this.classificatorsSubscription) {
      this.classificatorsSubscription.unsubscribe();
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

  onSelect(index) {
    this.initSelectionStatus();
    this.selectionState[index] = true;
    this.selectedClassificator = this.items[index];
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

  private getFilterClassificators(page: number) {

    if (this.classificatorsSubscription) {
      this.classificatorsSubscription.unsubscribe();
    }

    this.loadingClassificators = true;
    this.errorLoadingClassificators = false;

    this.classificatorsSubscription = this.adminService.getFilterClassificators(this.currentFilter.filterText, this.currentFilter.filterProperty, null, page, this.itemsPerPage)
      .subscribe(
        (response: { total: number, classificators: Clasificador[] }) => {
          this.items = response.classificators.slice();
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingClassificators = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total / this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingClassificators = false;
          this.errorLoadingClassificators = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterClassificators(page)
  }

  AddClassificator() {

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(ClassificatorEditComponent, { size: 'lg', centered: true });
    (<ClassificatorEditComponent>modalRef.componentInstance).classificator = null;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) => {
        if (response.confirmed) {
          this.notifyUpdateSuccess();
          this.getFilterClassificators(this.currentPage);
        }
      }
    );
  }

  EditClassificator() {

    if (!this.selectedClassificator) {
      var message: string = this.currentLang == "es" ? "Seleccione el clasificador." : "Select classificator.";
      this.messageService.generalMessage(false, message);
      return;
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(ClassificatorEditComponent, { size: 'lg', centered: true });
    (<ClassificatorEditComponent>modalRef.componentInstance).classificator = this.selectedClassificator;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) => {
        if (response.confirmed) {
          this.notifyUpdateSuccess();
          this.getFilterClassificators(this.currentPage);
        }
      }
    );
  }

  private notifyUpdateSuccess() {
    this.messageService.correctOperation();
  }

  private InitFilter() {
    this.currentFilter = {
      filterText: this.filterText != null && this.filterText != "null" ? this.filterText : "",
      filterProperty: ""
    };

    this.getFilterClassificators(0);
  }

    RemoveClassificator() {

      if (!this.selectedClassificator) {
        var message: string = this.currentLang == "es" ? "Seleccione el clasificador." : "Select classificator.";
        this.messageService.generalMessage(false, message);
        return;
      }

    if (this.classificatorsSubscription) {
      this.classificatorsSubscription.unsubscribe();
    }

    this.classificatorsSubscription = this.adminService.deleteClassificator(this.selectedClassificator.id)
      .subscribe(
        (response: { result: boolean }) => {
          if (response.result) {
            this.notifyUpdateSuccess();
          this.getFilterClassificators(this.currentPage);
          }
        },
        (error: HttpErrorResponse) => {

          console.log("error: HttpErrorResponse")
          console.log(error)

          this.messageService.wrongOperation(error.error.message);
        }
      );
  }

}
