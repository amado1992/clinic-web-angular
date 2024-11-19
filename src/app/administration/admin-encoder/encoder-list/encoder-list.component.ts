import { Component, OnInit, OnDestroy } from '@angular/core';
import { Codificador } from 'src/app/models/codificador.model';
import { EncoderEditComponent } from '../encoder-edit/encoder-edit.component';
import { Subscription, forkJoin, from } from 'rxjs';
import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faCog, faFilter, faEraser, faTimes, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'src/app/services/message.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-encoder-list',
  templateUrl: './encoder-list.component.html',
  styleUrls: ['./encoder-list.component.scss']
})
export class EncoderListComponent implements OnInit, OnDestroy {


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

  loadingEncoders: boolean;
  errorLoadingEncoders: boolean;
  encodersSubscription: Subscription;

  items: any[];

  clasificadores: any[];

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedEncoder: any;

  itemsPerPage = 5;
  currentPage = 0;
  totalItems = 0;
  totalPages: number = 1;

  findClassificator: string = 'null';
  
  modalSubscription: Subscription;

  currentFilter:any;

  constructor(private translateService: TranslateService, private messageEncoder: MessageService,
    private adminService: AdminUsersService, private modalEncoder: NgbModal, private userPreferences: UserPreferencesService) { }
  
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

    if (this.encodersSubscription) {
      this.encodersSubscription.unsubscribe();
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
        this.findClassificator = null;
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
      this.adminService.getRegisteredClassificators()
    ]
    this.dataSubscription = forkJoin(sources)
 
      .subscribe(
        ([clasificadores]: any[]) => {
          this.clasificadores = clasificadores;       

          this.InitFilter();

          this.loadingData = false;
        },
        (error: HttpErrorResponse) => {
          this.loadingData = false;
          this.errorLoadingData = true;

          console.log("error: HttpErrorResponse")
          console.log(error)
          
          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageEncoder.generalMessage(false, message);
        });

  }

  onSelect(index) {
    this.initSelectionStatus();
    this.selectionState[index] = true;
    this.selectedEncoder = this.items[index];
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

  private getFilterEncoders(page: number) {

    if (this.encodersSubscription) {
      this.encodersSubscription.unsubscribe();
    }

    this.loadingEncoders = true;
    this.errorLoadingEncoders = false;

    this.encodersSubscription = this.adminService.getFilterCodClassificators(this.currentFilter.filterText, this.currentFilter.filterProperty, null, page, this.itemsPerPage)
      .subscribe(
        (response: { total: number, codClassificators: Codificador[] }) => {
          this.items = response.codClassificators.slice();
          this.items = this.items.map(
            pkt => {

              let clasificadorNombre = "";

              //clasificadores
              if (pkt.clasificador) 
              {
                clasificadorNombre = pkt.clasificador.clasificador;
              }

              return {
                ...pkt,
                clasificadorNombre: clasificadorNombre
              };
            });
          this.totalItems = response.total;
          this.currentPage = page;
          this.loadingEncoders = false;
          this.totalPages = (response.total > 0) ? (Math.floor(response.total/ this.itemsPerPage) + 1) : 1;
        },
        (error: HttpErrorResponse) => {
          this.loadingEncoders = false;
          this.errorLoadingEncoders = true;

          console.log("error: HttpErrorResponse")
          console.log(error)

          var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageEncoder.generalMessage(false, message);
        }
      )
  }

  pageChanged(page) {

    this.getFilterEncoders(page)
  }

  AddEncoder() {

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const modalRef = this.modalEncoder.open(EncoderEditComponent, { size: 'lg', centered: true });
    (<EncoderEditComponent>modalRef.componentInstance).clasificadoresRegistrados = this.clasificadores;
    (<EncoderEditComponent>modalRef.componentInstance).encoder = null;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean } ) =>
      {
        if (response.confirmed)
        {
          this.notifyUpdateSuccess();
          this.getFilterEncoders(this.currentPage);
        }
      }
    );
  }

  EditEncoder() {

    if(!this.selectedEncoder)
    {
      var message: string = this.currentLang == "es" ? "Seleccione el codificador." : "Select encoder.";
      this.messageEncoder.generalMessage(false, message);
      return;
    }

    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
    
    const modalRef = this.modalEncoder.open(EncoderEditComponent, { size: 'lg', centered: true });
    (<EncoderEditComponent>modalRef.componentInstance).clasificadoresRegistrados = this.clasificadores;
    (<EncoderEditComponent>modalRef.componentInstance).encoder = this.selectedEncoder;
    this.modalSubscription = from(modalRef.result).subscribe(
      (response: { confirmed: boolean }) =>
      {
        if (response.confirmed)
        {
          this.notifyUpdateSuccess();
          this.getFilterEncoders(this.currentPage);
        }
      }
    );
  }
  
  private notifyUpdateSuccess() {
    this.messageEncoder.correctOperation();
  }

  private InitFilter()
  {
    this.currentFilter = {
      filterText: this.filterText != null && this.filterText != "null" ? this.filterText : "",
      filterProperty: ""
    };

    this.getFilterEncoders(0);
  }

  RemoveEncoder() {

    if(!this.selectedEncoder)
    {
      var message: string = this.currentLang == "es" ? "Seleccione el codificador." : "Select encoder.";
      this.messageEncoder.generalMessage(false, message);
      return;
    }

    if (this.encodersSubscription) {
      this.encodersSubscription.unsubscribe();
    }

    this.encodersSubscription = this.adminService.deleteCodClassificator(this.selectedEncoder.id)
      .subscribe(
        (response: { result: boolean }) => {
          if (response.result) {
            this.notifyUpdateSuccess();
            this.getFilterEncoders(this.currentPage);
          }
        },
        (error: HttpErrorResponse) => {

          console.log("error: HttpErrorResponse")
          console.log(error)

          this.messageEncoder.wrongOperation(error.error.message);
        }
      );
  }

}
