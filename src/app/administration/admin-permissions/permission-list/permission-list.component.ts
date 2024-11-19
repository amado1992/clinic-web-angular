import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, from } from 'rxjs';
import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faPenSquare, faCog, faFilter, faEraser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { MessageService } from 'src/app/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Permiso } from 'src/app/models/permiso.model';
import { PermissionEditComponent } from '../permission-edit/permission-edit.component';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit, OnDestroy {

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

  loadingPermissions: boolean;
  errorLoadingPermissions: boolean;
  permissionsSubscription: Subscription;

  items: any[];

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedPermission: any;

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

    if (this.permissionsSubscription) {
      this.permissionsSubscription.unsubscribe();
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
    this.selectedPermission = this.items[index];
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

  private getFilterPermissions(page: number) {

    if (this.permissionsSubscription) {
      this.permissionsSubscription.unsubscribe();
    }

    this.loadingPermissions = true;
    this.errorLoadingPermissions = false;

    this.permissionsSubscription = this.adminService.getFilterPermissions(this.currentFilter.filterText, this.currentFilter.filterProperty, null, page, this.itemsPerPage)  
    .subscribe(
        (response: { total: number, permissions: Permiso[] }) => {
          this.items = response.permissions.slice();
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingPermissions = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total / this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingPermissions = false;
          this.errorLoadingPermissions = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterPermissions(page)
  }

  AddPermission() {

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(PermissionEditComponent, { size: 'sm', centered: true });
    (<PermissionEditComponent>modalRef.componentInstance).permission = null;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) => {
        if (response.confirmed) {
          this.notifyUpdateSuccess();
          this.getFilterPermissions(this.currentPage);
        }
      }
    );
  }

  EditPermission() {

    if (!this.selectedPermission) {
      var message: string = this.currentLang == "es" ? "Seleccione el permiso." : "Select permission.";
      this.messageService.generalMessage(false, message);
      return;
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(PermissionEditComponent, { size: 'sm', centered: true });
    (<PermissionEditComponent>modalRef.componentInstance).permission = this.selectedPermission;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) => {
        if (response.confirmed) {
          this.notifyUpdateSuccess();
          this.getFilterPermissions(this.currentPage);
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

    this.getFilterPermissions(0);
  }

    RemovePermission() {

      if (!this.selectedPermission) {
        var message: string = this.currentLang == "es" ? "Seleccione el permiso." : "Select permission.";
        this.messageService.generalMessage(false, message);
        return;
      }

    if (this.permissionsSubscription) {
      this.permissionsSubscription.unsubscribe();
    }

    this.permissionsSubscription = this.adminService.deletePermission(this.selectedPermission.id)
      .subscribe(
        (response: { result: boolean }) => {
          if (response.result) {
            this.notifyUpdateSuccess();
          this.getFilterPermissions(this.currentPage);
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
