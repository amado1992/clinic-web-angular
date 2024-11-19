import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, from } from 'rxjs';
import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faPenSquare, faCog, faFilter, faEraser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { MessageService } from 'src/app/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Rama } from 'src/app/models/rama.model';
import { BranchEditComponent } from '../../admin-branchs/branch-edit/branch-edit.component';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import Swal from 'sweetalert'
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit, OnDestroy {

  isCollapsed: boolean = false;
  loadingData: boolean;
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

  loadingBranchs: boolean;
  errorLoadingBranchs: boolean;
  branchsSubscription: Subscription;

  items: any[];

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedBranch: any;

  itemsPerPage = 5;
  currentPage = 0;
  totalItems = 0;
  totalPages: number = 1;

  modalSubscription: Subscription;

  currentFilter: any;

  constructor(private translateService: TranslateService, private messageService: MessageService,
    private adminService: AdminUsersService, private modalService: NgbModal, private userPreferences: UserPreferencesService) { }

  ngOnInit() {
    this.loadingData = false;
    this.itemsPerPage = this.userPreferences.getItemsPerPage();
    this.hookLang();
    this.initSelectionStatus();
    this.InitFilter();
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }

    if (this.branchsSubscription) {
      this.branchsSubscription.unsubscribe();
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
    this.selectedBranch = this.items[index];
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

  private getFilterBranchs(page: number) {

    if (this.branchsSubscription) {
      this.branchsSubscription.unsubscribe();
    }

    this.loadingBranchs = true;
    this.errorLoadingBranchs = false;

    this.branchsSubscription = this.adminService.getFilterBranchs(this.currentFilter.filterText, this.currentFilter.filterProperty, null, page, this.itemsPerPage)
    .subscribe(
        (response: { total: number, branchs: Rama[] }) => {
          this.items = response.branchs.slice();
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingBranchs = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total / this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingBranchs = false;
          this.errorLoadingBranchs = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterBranchs(page)
  }

  AddBranch() {

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(BranchEditComponent, { size: 'sm', centered: true });
    (<BranchEditComponent>modalRef.componentInstance).branch = null;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) => {
        if (response.confirmed) {
          this.notifyUpdateSuccess();
          this.getFilterBranchs(this.currentPage);
        }
      }
    );
  }

  EditBranch() {

    if (!this.selectedBranch) {
      var message: string = this.currentLang == "es" ? "Seleccione la rama." : "Select branch.";
      this.messageService.generalMessage(false, message);
      return;
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalService.open(BranchEditComponent, { size: 'sm', centered: true });
    (<BranchEditComponent>modalRef.componentInstance).branch = this.selectedBranch;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) => {
        if (response.confirmed) {
          this.notifyUpdateSuccess();
          this.getFilterBranchs(this.currentPage);
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

    this.getFilterBranchs(0);
    this.loadingData = true;
  }

  RemoveBranch() {

    Swal({
      title:  this.currentLang == "es" ? "¿Está seguro?" : "Are you sure?",
      text: this.currentLang == "es" ? "Una vez borrada la rama no se podrá recuperar." : "Once deleted, you will not be able to recover this branch!",
      icon: "warning",
      buttons:{cancel:true,confirm:true},
      dangerMode:true,
    })
    .then((willDelete) => {
      if (willDelete) {

        if (!this.selectedBranch) {
          var message: string = this.currentLang == "es" ? "Seleccione la rama." : "Select branch.";
          this.messageService.generalMessage(false, message);
          return;
        }
    
        if (this.branchsSubscription) {
          this.branchsSubscription.unsubscribe();
        }
    
        this.branchsSubscription = this.adminService.deleteBranch(this.selectedBranch.id)
          .subscribe(
            (response: { result: boolean }) => {
              if (response.result)
              {
                Swal(this.currentLang == "es" ? "La rama ha sido borrada." :"The branch has been deleted!", {
                  icon: "success",
                });
                this.notifyUpdateSuccess();
                this.getFilterBranchs(this.currentPage);
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
