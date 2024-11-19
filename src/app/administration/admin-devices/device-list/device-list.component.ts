import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, from } from 'rxjs';
import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faPenSquare, faCog, faFilter, faEraser, faSquare, faCheckSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { MessageService } from 'src/app/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { DeviceEditComponent } from '../device-edit/device-edit.component';
import { Device } from 'src/app/models/device.model';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import Swal from 'sweetalert'
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, OnDestroy {

  isCollapsed: boolean = false;

  faPlusSquareIcon = faPlusSquare;
  faPenSquareIcon = faPenSquare;
  faCogIcon = faCog;
  faFilterIcon = faFilter;
  faEraserIcon = faEraser;
  faEye = faEye;
  faEdit=faEdit;
  faPlusCircle=faPlusCircle;
  faSearch=faSearch;
  faSquareIcon = faSquare;
  faCheckSquareIcon = faCheckSquare;

  faTimesIcon = faTimes;

  private filterText = '';

  currentLang: string;
  langSubscription: Subscription;

  loadingDevices: boolean;
  errorLoadingDevices: boolean;
  devicesSubscription: Subscription;

  dataSubscription: Subscription;

  items: any[];

  locations: any[];

  findLocation: string = "0";

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedDevice: any;

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

    if (this.devicesSubscription) {
      this.devicesSubscription.unsubscribe();
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

  }

  FilterAction(actionId: string) {
    switch (actionId) {
      case 'filter':
        this.InitFilter();
        break;
      case 'clean':
        this.filterText = "";
        this.findLocation = "0";
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
    this.selectedDevice = this.items[index];
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

  private getFilterDevices(page: number) {

    if (this.devicesSubscription) {
      this.devicesSubscription.unsubscribe();
    }

    this.loadingDevices = true;
    this.errorLoadingDevices = false;

    this.devicesSubscription = this.adminService.getFilterExternalDevices(this.currentFilter.filterText,
      this.currentFilter.locationId, this.currentFilter.filterProperty, null, page, this.itemsPerPage)
  
      .subscribe(
        (response: { total: number, devices: Device[] }) => {
          this.items = response.devices.slice();
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingDevices = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total / this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingDevices = false;
          this.errorLoadingDevices = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterDevices(page);
  }

  AddDevice() {

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(DeviceEditComponent, { size: 'lg', centered: true });
    (<DeviceEditComponent>modalRef.componentInstance).device = null;
    (<DeviceEditComponent>modalRef.componentInstance).localizacionesRegistradas = this.locations;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) => {
        if (response.confirmed) {
          this.notifyUpdateSuccess();
          this.getFilterDevices(this.currentPage);
        }
      }
    );
  }

  EditDevice() {

    if (!this.selectedDevice) {
      var message: string = this.currentLang == "es" ? "Seleccione el dispositivo." : "Select device.";
      this.messageService.generalMessage(false, message);
      return;
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(DeviceEditComponent, { size: 'lg', centered: true });
    (<DeviceEditComponent>modalRef.componentInstance).device = this.selectedDevice;
    (<DeviceEditComponent>modalRef.componentInstance).localizacionesRegistradas = this.locations;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) => {
        if (response.confirmed) {
          this.notifyUpdateSuccess();
          this.getFilterDevices(this.currentPage);
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
      locationId: this.findLocation !== '0' ? this.findLocation : '0',
      filterProperty: ""
    };

    this.getFilterDevices(0);
  }

  private initDataFilter() {
    this.loadingDevices = true;
    this.errorLoadingDevices = false;
    const sources = [
      this.adminService.getRegisteredLocations()
    ];

    this.dataSubscription = forkJoin(sources)
      .subscribe(
        ([locations]: any[]) => {
          this.locations = locations;

          this.InitFilter();
        },
        (error: HttpErrorResponse) => {
          this.loadingDevices = false;
          this.errorLoadingDevices = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        });

  }

  RemoveDevice() {

    Swal({
      title:  this.currentLang == "es" ? "¿Está seguro?" : "Are you sure?",
      text: this.currentLang == "es" ? "Una vez borrado el dispositivo no se podrá recuperar." : "Once deleted, you will not be able to recover this device!",
      icon: "warning",
      buttons:{cancel:true,confirm:true},
      dangerMode:true,
    })
    .then((willDelete) => {
      if (willDelete) {
        if (!this.selectedDevice) {
          var message: string = this.currentLang == "es" ? "Seleccione el dispositivo." : "Select device.";
          this.messageService.generalMessage(false, message);
          return;
        }
    
        if (this.devicesSubscription) {
          this.devicesSubscription.unsubscribe();
        }
    
        this.devicesSubscription = this.adminService.deleteExternalDevice(this.selectedDevice.id)
          .subscribe(
            (response: { result: boolean }) => {
              if (response.result) {
                Swal(this.currentLang == "es" ? "El dispositivo ha sido borrado." :"The device has been deleted!", {
                  icon: "success",
                });
                this.notifyUpdateSuccess();
                this.getFilterDevices(this.currentPage);
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
