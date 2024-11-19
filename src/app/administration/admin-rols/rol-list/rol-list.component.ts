import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, from } from 'rxjs';
import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faPenSquare, faCog, faFilter, faEraser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { MessageService } from 'src/app/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from 'src/app/models/role.model';
import { RolEditComponent } from '../rol-edit/rol-edit.component';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import Swal from 'sweetalert'
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-rol-list',
  templateUrl: './rol-list.component.html',
  styleUrls: ['./rol-list.component.scss']
})
export class RolListComponent implements OnInit, OnDestroy {

  isCollapsed: boolean = false;

  loadingData: boolean;
  errorLoadingData: boolean;

  dataSubscription: Subscription;

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

  loadingRoles: boolean;
  errorLoadingRoles: boolean;
  rolesSubscription: Subscription;

  permisos: any[];

  items: any[];

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedRole: any;

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

    if (this.rolesSubscription) {
      this.rolesSubscription.unsubscribe();
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

  private initDataFilter() {
    this.loadingData = true;
    this.errorLoadingData = false;
    const sources = [
      this.adminService.getRegisteredPermissions()
    ]
    this.dataSubscription = forkJoin(sources)
      .subscribe(
        ([permisos]: any[]) => {
          this.permisos = permisos;

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
    this.selectedRole = this.items[index];
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

  private getFilterRoles(page: number) {

    if (this.rolesSubscription) {
      this.rolesSubscription.unsubscribe();
    }

    this.loadingRoles = true;
    this.errorLoadingRoles = false;

    this.rolesSubscription = this.adminService.getFilterRoles(this.currentFilter.filterText, this.currentFilter.filterProperty, null, page, this.itemsPerPage)
      .subscribe(
        (response: { total: number, rols: Role[] }) => {
          this.items = response.rols.slice();
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingRoles = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total / this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingRoles = false;
          this.errorLoadingRoles = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterRoles(page)
  }

  AddRole() {

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(RolEditComponent, { size: 'lg', centered: true });
    (<RolEditComponent>modalRef.componentInstance).permisosRegistrados = this.permisos;
    (<RolEditComponent>modalRef.componentInstance).roleId = "0";
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) => {
        if (response.confirmed) {
          this.notifyUpdateSuccess();
          this.getFilterRoles(this.currentPage);
        }
      }
    );
  }

  EditRole() {

    if (!this.selectedRole) {
      var message: string = this.currentLang == "es" ? "Seleccione el rol." : "Select role.";
      this.messageService.generalMessage(false, message);
      return;
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(RolEditComponent, { size: 'lg', centered: true });
    (<RolEditComponent>modalRef.componentInstance).permisosRegistrados = this.permisos;
    (<RolEditComponent>modalRef.componentInstance).roleId = this.selectedRole.id;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) => {
        if (response.confirmed) {
          this.notifyUpdateSuccess();
          this.getFilterRoles(this.currentPage);
        }
      }
    );
  }

  private notifyUpdateSuccess() {
    this.messageService.correctOperation();
  }

  private InitFilter() 
  {
    this.currentFilter = 
    {
      filterText: this.filterText != null && this.filterText != "null" ? this.filterText : "",
      filterProperty: ""
    };

    this.getFilterRoles(0);
  }

  RemoveRole() {


    Swal({
      title:  this.currentLang == "es" ? "¿Está seguro?" : "Are you sure?",
      text: this.currentLang == "es" ? "Una vez borrada el rol no se podrá recuperar." : "Once deleted, you will not be able to recover this role!",
      icon: "warning",
      buttons:{cancel:true,confirm:true},
      dangerMode:true,
    })
    .then((willDelete) => {
      if (willDelete) {
        if (!this.selectedRole) {
          var message: string = this.currentLang == "es" ? "Seleccione el rol." : "Select role.";
          this.messageService.generalMessage(false, message);
          return;
        }
    
        if (this.rolesSubscription) {
          this.rolesSubscription.unsubscribe();
        }
    
        this.rolesSubscription = this.adminService.deleteRol(this.selectedRole.id)
          .subscribe(
            (response: { result: boolean }) => {
              if (response.result) {
                Swal(this.currentLang == "es" ? "El rol ha sido borrada." :"The role has been deleted!", {
                  icon: "success",
                });
                this.notifyUpdateSuccess();
                this.getFilterRoles(this.currentPage);
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
