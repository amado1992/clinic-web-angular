import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, from } from 'rxjs';
import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faPenSquare, faCog, faFilter, faEraser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { MessageService } from 'src/app/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Servicio } from 'src/app/models/servicio.model';
import { ServiceEditComponent } from '../service-edit/service-edit.component';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import Swal from 'sweetalert'
import { timeout, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit, OnDestroy {


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

  currentLang: string;
  langSubscription: Subscription;

  loadingServices: boolean;
  errorLoadingServices: boolean;
  servicesSubscription: Subscription;

  items: any[];

  ramas: any[];

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedService: any;

  itemsPerPage = 5;
  currentPage = 0;
  totalItems = 0;
  totalPages: number = 1;

  findBranch: string = '0';
  
  modalSubscription: Subscription;

  currentFilter:any;

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

    if (this.servicesSubscription) {
      this.servicesSubscription.unsubscribe();
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
        this.findBranch = "0";
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
      this.adminService.getRegisteredBranchs()
    ]
    this.dataSubscription = forkJoin(sources)

      .subscribe(
        ([ramas]: any[]) => {
          this.ramas = ramas;       

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
    this.selectedService = this.items[index];
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

  private getFilterServices(page: number) {

    if (this.servicesSubscription) {
      this.servicesSubscription.unsubscribe();
    }

    this.loadingServices = true;
    this.errorLoadingServices = false;

    this.servicesSubscription = this.adminService.getFilterServices(this.currentFilter.filterText, this.currentFilter.branchId, this.currentFilter.filterProperty, null, page, this.itemsPerPage)
      .subscribe(
        (response: { total: number, services: Servicio[] }) => {
          this.items = response.services.slice();
          this.items = this.items.map(
            pkt => {

              let ramaNombre = "";
              let colorTabla = "";

              //ramas
              if (pkt.rama) 
              {
                ramaNombre = pkt.rama.nombre;
              }
              if(pkt.color)
              {
                colorTabla = pkt.color;
              }
              else
              {
                colorTabla = "#f9f9fa";
              }

              return {
                ...pkt,
                ramaNombre: ramaNombre,
                colorTabla: colorTabla
              };
            });
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingServices = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total/ this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingServices = false;
          this.errorLoadingServices = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterServices(page)
  }

  AddService() {

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(ServiceEditComponent, { size: 'lg', centered: true });
    (<ServiceEditComponent>modalRef.componentInstance).ramasRegistradas = this.ramas;
    (<ServiceEditComponent>modalRef.componentInstance).service = null;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean } ) =>
      {
        if (response.confirmed)
        {
          this.notifyUpdateSuccess();
          this.getFilterServices(this.currentPage);
        }
      }
    );
  }

  EditService() {

    if(!this.selectedService)
    {
      var message: string = this.currentLang == "es" ? "Seleccione el servicio." : "Select service.";
      this.messageService.generalMessage(false, message);
      return;
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
    
    const modalRef = this.modalService.open(ServiceEditComponent, { size: 'lg', centered: true });
    (<ServiceEditComponent>modalRef.componentInstance).ramasRegistradas = this.ramas;
    (<ServiceEditComponent>modalRef.componentInstance).service = this.selectedService;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) =>
      {
        if (response.confirmed)
        {
          this.notifyUpdateSuccess();
          this.getFilterServices(this.currentPage);
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
      branchId: this.findBranch !== '0' ? this.findBranch : '0',
      filterProperty: ""
    };

    this.getFilterServices(0);
  }

  RemoveService() {

    Swal({
      title:  this.currentLang == "es" ? "¿Está seguro?" : "Are you sure?",
      text: this.currentLang == "es" ? "Una vez borrado el servicio no se podrá recuperar." : "Once deleted, you will not be able to recover this service!",
      icon: "warning",
      buttons:{cancel:true,confirm:true},
      dangerMode:true,
    })
    .then((willDelete) => {
      if (willDelete) {
        if(!this.selectedService)
        {
          var message: string = this.currentLang == "es" ? "Seleccione el servicio." : "Select service.";
          this.messageService.generalMessage(false, message);
          return;
        }
    
        if (this.servicesSubscription) {
          this.servicesSubscription.unsubscribe();
        }
    
        this.servicesSubscription = this.adminService.deleteService(this.selectedService.id)
          .subscribe(
            (response: { result: boolean }) => {
              if (response.result) {
                Swal(this.currentLang == "es" ? "El servicio ha sido borrada." :"The service has been deleted!", {
                  icon: "success",
                });
                this.notifyUpdateSuccess();
                this.getFilterServices(this.currentPage);
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
