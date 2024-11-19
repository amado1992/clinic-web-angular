import { Component, OnInit, OnDestroy } from '@angular/core';
import { OpcionPago } from 'src/app/models/opcionPago.model';
import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faPenSquare, faCog, faFilter, faEraser, faSquare, faCheckSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription, from } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentEditComponent } from '../payment-edit/payment-edit.component';
import Swal from 'sweetalert'
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit, OnDestroy {

  isCollapsed: boolean = false;
  
  faPlusSquareIcon = faPlusSquare;
  faPenSquareIcon = faPenSquare;
  faCogIcon = faCog;
  faFilterIcon = faFilter;
  faEraserIcon = faEraser;

  faSquareIcon = faSquare;
  faCheckSquareIcon = faCheckSquare;
  faTimesIcon = faTimes;
  faEye = faEye;
  faEdit=faEdit;
  faPlusCircle=faPlusCircle;
  faSearch=faSearch;

  private filterText = '';

  findInsurance: boolean;
  
  currentLang: string;
  langSubscription: Subscription;

  loadingPayments: boolean;
  errorLoadingPayments: boolean;
  paymentsSubscription: Subscription;

  items: any[];

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedPayment: any;
  initFirst:boolean=true;

  itemsPerPage = 5;
  currentPage = 0;
  totalItems = 0;
  totalPages: number = 1;
  
  modalSubscription: Subscription;  

  currentFilter:any;
  
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
  
      if (this.paymentsSubscription) {
        this.paymentsSubscription.unsubscribe();
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
          this.findInsurance = false;
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
      this.selectedPayment = this.items[index];
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

    private getFilterPayments(page: number) {

      if (this.paymentsSubscription) {
        this.paymentsSubscription.unsubscribe();
      }

      this.loadingPayments = true;
      this.errorLoadingPayments = false;

      this.paymentsSubscription = this.adminService.getFilterPaymentOptions(this.currentFilter.filterText, this.currentFilter.filterInsurance, this.currentFilter.filterProperty, null, page, this.itemsPerPage)
    
      .subscribe(
          (response: { total: number, paymentOptions: OpcionPago[] }) => {
            this.items = response.paymentOptions.slice();
            this.items = this.items.map(
              pkt => {
  
                let insuranceValue = false;

                if (pkt.tipoSeguro) 
                {
                  insuranceValue = pkt.tipoSeguro === "1" ? true : false;
                }
  
                return {
                  ...pkt,
                  insuranceValue: insuranceValue,
                };
              });
            this.totalItems = response.total;
            this.currentPage = page;
            this.loadingPayments = false;
            this.totalPages = (response.total > 0) ? (Math.floor(response.total/ this.itemsPerPage) + 1) : 1;
          },
          (error: HttpErrorResponse) => {
            this.loadingPayments = false;
            this.errorLoadingPayments = true;
  
            console.log("error: HttpErrorResponse")
            console.log(error)
  
            var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
            this.messageService.generalMessage(false, message);
          }
        )
    }

    pageChanged(page) {

      this.getFilterPayments(page)
    }

    AddPayment() {
  
      if (this.modalSubscription) {
        this.modalSubscription.unsubscribe();
      }
  
      const modalRef = this.modalService.open(PaymentEditComponent, { size: 'lg', centered: true });
      (<PaymentEditComponent>modalRef.componentInstance).payment = null;
      this.modalSubscription = from(modalRef.result).subscribe(
        (response: { confirmed: boolean } ) =>
        {
          if (response.confirmed)
          {
            console.log("Imsert add... ", response)
            this.notifyUpdateSuccess();
            this.getFilterPayments(this.currentPage);
          }
        }
      );
    }

    EditPayment() {

      if(!this.selectedPayment)
      {
        var message: string = this.currentLang == "es" ? "Seleccione la opción de pago." : "Select payment option.";
        this.messageService.generalMessage(false, message);
        return;
      }
  
      if (this.modalSubscription) {
        this.modalSubscription.unsubscribe();
      }
      
      const modalRef = this.modalService.open(PaymentEditComponent, { size: 'lg', centered: true });
      (<PaymentEditComponent>modalRef.componentInstance).payment = this.selectedPayment;
      this.modalSubscription = from(modalRef.result).subscribe(
        (response: { confirmed: boolean }) =>
        {
          if (response.confirmed)
          {
            this.notifyUpdateSuccess();
            this.getFilterPayments(this.currentPage);
          }
        }
      );
    }

    private notifyUpdateSuccess() {
      this.messageService.correctOperation();
    }

    private InitFilter()
  {
    if(this.initFirst){

      this.currentFilter = {
        filterText: this.filterText != null && this.filterText != "null" ? this.filterText : "",
        filterInsurance: "",
        filterProperty: ""
      };
      this.initFirst=false;

    }else{

      this.currentFilter = {
        filterText: this.filterText != null && this.filterText != "null" ? this.filterText : "",
        filterInsurance: this.findInsurance ? "1" : "0",
        filterProperty: ""
      };

    }
   

    this.getFilterPayments(0);
  }

  RemovePayment() {

    Swal({
      title:  this.currentLang == "es" ? "¿Está seguro?" : "Are you sure?",
      text: this.currentLang == "es" ? "Una vez borrada la opción de pago no se podrá recuperar." : "Once deleted, you will not be able to recover this payment option!",
      icon: "warning",
      buttons:{cancel:true,confirm:true},
      dangerMode:true,
    })
    .then((willDelete) => {
      if (willDelete) {
        if(!this.selectedPayment)
        {
          var message: string = this.currentLang == "es" ? "Seleccione la opción de pago." : "Select payment option.";
          this.messageService.generalMessage(false, message);
          return;
        }
    
        if (this.paymentsSubscription) {
          this.paymentsSubscription.unsubscribe();
        }
    
        this.paymentsSubscription = this.adminService.deleteOpcionPago(this.selectedPayment.id)
          .subscribe(
            (response: { result: boolean }) => {
              if (response.result) {
                Swal(this.currentLang == "es" ? "La la opción de pago  ha sido borrada." :"The payment option has been deleted!", {
                  icon: "success",
                });
                this.notifyUpdateSuccess();
                this.getFilterPayments(this.currentPage);
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
