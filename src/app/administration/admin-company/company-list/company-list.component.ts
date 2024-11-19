import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { ICompany, OpcionPago } from 'src/app/models/opcionPago.model';
import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faPenSquare, faCog, faFilter, faEraser, faSquare, faCheckSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription, from, combineLatest } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CompanyEditComponent } from '../company-edit/company-edit.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert'
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnDestroy {
  loadingDelete: boolean = true
  @ViewChild('myTemplate') customTemplate: TemplateRef<any>;
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

  findInsurance: boolean = false;
  
  currentLang: string;
  langSubscription: Subscription;

  loadingCompanys: boolean;
  errorLoadingCompanys: boolean;
  companysSubscription: Subscription;

  items: any[];

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedCompany: any;

  itemsPerPage = 5;
  currentPage = 0;
  totalItems = 0;
  totalPages: number = 1;
  
  modalSubscription: Subscription;  

  currentFilter:any;

  modalRef: BsModalRef;
  bsModalRef: BsModalRef;
  
  constructor(private translateService: TranslateService, private messageService: MessageService,
    private adminService: AdminUsersService, /*private modalService: NgbModal*/ private modalService: BsModalService, private userPreferences: UserPreferencesService
    ,private changeDetection: ChangeDetectorRef) { }
  
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
  
      if (this.companysSubscription) {
        this.companysSubscription.unsubscribe();
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
          this.InitFilter()
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
      this.selectedCompany = this.items[index];
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

    private getFilterCompanys(page: number) {

      if (this.companysSubscription) {
        this.companysSubscription.unsubscribe();
      }

      this.loadingCompanys = true;
      this.errorLoadingCompanys = false;

      this.companysSubscription = this.adminService.getFilterInsuranceCompany(this.currentFilter.filterText, this.currentFilter.filterInsurance, this.currentFilter.filterProperty, null, page, this.itemsPerPage)
    
        .subscribe(
          (response: { total: number, compannias: ICompany[] }) => {
            this.items = response.compannias.slice();
            
            this.totalItems = response.total;
            this.currentPage = page;
            this.loadingCompanys = false;
            this.totalPages = (response.total > 0) ? (Math.floor(response.total/ this.itemsPerPage) + 1) : 1;
          },
          (error: HttpErrorResponse) => {
            this.loadingCompanys = false;
            this.errorLoadingCompanys = true;
  
            console.log("error: HttpErrorResponse")
            console.log(error)
  
            var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
            this.messageService.generalMessage(false, message);
          }
        )
    }

    pageChanged(page) {

      this.getFilterCompanys(page)
    }

    AddCompany() {
      const initialState = {
        company: null
      };

      if (this.modalSubscription) {
        this.modalSubscription.unsubscribe();
      }

      const _combine = combineLatest(
        this.modalService.onHide,
        this.modalService.onHidden
      ).subscribe(() =>{
       //this.notifyUpdateSuccess();
       this.getFilterCompanys(this.currentPage);}
       );
   
      this.bsModalRef = this.modalService.show(CompanyEditComponent, { class: 'modal-md', initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
    }

    EditCompany() {
     
      if(!this.selectedCompany)
      {
        var message: string = this.currentLang == "es" ? "Seleccione la opción de pago." : "Select company option.";
        this.messageService.generalMessage(false, message);
        return;
      }

      const initialState = {
        company: this.selectedCompany
      };
  
      if (this.modalSubscription) {
        this.modalSubscription.unsubscribe();
      }

      const _combine = combineLatest(
        this.modalService.onHide,
        this.modalService.onHidden
      ).subscribe(() =>{
       //this.notifyUpdateSuccess();
       this.getFilterCompanys(this.currentPage);}
       );
   
      this.bsModalRef = this.modalService.show(CompanyEditComponent, { class: 'modal-md', initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
    }

    private notifyUpdateSuccess() {
      this.messageService.correctOperation();
    }

    private InitFilter()
  {
    this.currentFilter = {
      filterText: this.filterText != null && this.filterText != "null" ? this.filterText : "",
      filterInsurance: this.findInsurance ? "1" : "",
      filterProperty: ""
    };

    this.getFilterCompanys(0);
  }

  RemoveCompany() {

    Swal({
      title:  this.currentLang == "es" ? "¿Está seguro?" : "Are you sure?",
      text: this.currentLang == "es" ? "Una vez borrada la compañía no se podrá recuperar." : "Once deleted, you will not be able to recover this company!",
      icon: "warning",
      buttons:{cancel:true,confirm:true},
      dangerMode:true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.loadingDelete = false

    if(!this.selectedCompany)
    {
      var message: string = this.currentLang == "es" ? "Seleccione la compa&ntilde;&iacute;a." : "Select company option.";
      this.messageService.generalMessage(false, message);
      return;
    }

    if (this.companysSubscription) {
      this.companysSubscription.unsubscribe();
    }

    this.companysSubscription = this.adminService.deleteInsuranceCompany(this.selectedCompany.id)
      .subscribe(
        (response: { result: boolean }) => {
          if (response.result) {

            this.loadingDelete = true
            //this.modalRef.hide();
            Swal({
              text: this.currentLang == "es" ? "La compañía ha sido borrada." :"The company has been deleted!", 
              icon: "success",
            });
            this.notifyUpdateSuccess();
            this.getFilterCompanys(this.currentPage);
          }
        },
        (error: HttpErrorResponse) => {
          this.loadingDelete = true
          console.log("error: HttpErrorResponse")
          console.log(error)

          this.messageService.wrongOperation(error.error.message);
        }
      );
        
      } 
    });
  
  }

  openModal() {
    if(!this.selectedCompany)
    {
      var message: string = this.currentLang == "es" ? "Seleccione la opción de pago." : "Select company option.";
      this.messageService.generalMessage(false, message);
      return;
    }
    
    //this.modalRef = this.modalService.show(this.customTemplate, {class: 'modal-sm'});
    this.modalRef = this.modalService.show(this.customTemplate);
    this.modalRef.setClass('modal-custom-style');
  }
 
  confirm(): void {
    //this.modalRef.hide();
    this.RemoveCompany()
  }
 
  decline(): void {
    this.modalRef.hide();
  }
}
