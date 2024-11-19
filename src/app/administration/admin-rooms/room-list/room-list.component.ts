import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, from } from 'rxjs';
import { faSearch,faPlusCircle,faEdit,faEye,faPlusSquare, faPenSquare, faCog, faFilter, faEraser, faSquare, faCheckSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { MessageService } from 'src/app/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { RoomEditComponent } from '../room-edit/room-edit.component';
import { Sala } from 'src/app/models/sala.model';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import Swal from 'sweetalert'
import { timeout, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})



export class RoomListComponent implements OnInit, OnDestroy {

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

  findActive: boolean = false;
  findAvailable: boolean = false;
  
  currentLang: string;
  langSubscription: Subscription;

  loadingRooms: boolean;
  errorLoadingRooms: boolean;
  roomsSubscription: Subscription;

  items: any[];

  selectionState: { [row: number]: boolean; };

  selectedIndex: number;
  selectedRoom: any;

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
  
      if (this.roomsSubscription) {
        this.roomsSubscription.unsubscribe();
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
          this.findActive = false;
          this.findAvailable = false;
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
      this.selectedRoom = this.items[index];
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

    private getFilterRooms(page: number) {

      if (this.roomsSubscription) {
        this.roomsSubscription.unsubscribe();
      }

      this.loadingRooms = true;
      this.errorLoadingRooms = false;
      //console.log("accede a getfilterooms");
      this.roomsSubscription = this.adminService.getFilterRooms(this.currentFilter.filterText, this.currentFilter.filterActive, this.currentFilter.filterAvailable, this.currentFilter.filterProperty, null, page, this.itemsPerPage)
      .subscribe(
          (response: { total: number, rooms: Sala[] }) => {
            console.log("Respuesta"+response);
            this.items = response.rooms.slice();
            this.items = this.items.map(
              pkt => {
  
                let activeValue = false;
                let availableValue = false;

                if (pkt.activa) 
                {
                  activeValue = pkt.activa === "1" ? true : false;
                }

                if (pkt.disponible) 
                {
                  availableValue = pkt.disponible === "1" ? true : false;
                }
  
                return {
                  ...pkt,
                  activeValue: activeValue,
                  availableValue: availableValue,
                };
              });
              var roomObj = JSON.parse(JSON.stringify(this.items));
              //console.log("json"+JSON.stringify(roomObj))
              var roomArray = new Array()
              roomObj.forEach((item) => {
                Object.entries(item).forEach(([key, val]) => {
                  //console.log(`key-${key}-val-${JSON.stringify(val)}`)
                  if(key=="orden")
                  {
                   roomArray.push(val)
                  }
                  

                });
              });
            localStorage.setItem("roomItems",roomArray.toString());
            /*var orderAvailable = localStorage.getItem("roomItems");
            console.log("rooms"+orderAvailable);*/
          
            
            this.totalItems = response.total;
            this.currentPage = page;
            this.loadingRooms = false;
            this.totalPages = (response.total > 0) ? (Math.floor(response.total/ this.itemsPerPage) + 1) : 1;
            

          },
          (error: HttpErrorResponse) => {
            //console.log("error: HttpErrorResponse");
            this.loadingRooms = false;
            this.errorLoadingRooms = true;
            var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
            this.messageService.generalMessage(false, message);
          }
        )
        
       
    }

    pageChanged(page) {

      this.getFilterRooms(page)
    }

    AddRoom() {
  
      if (this.modalSubscription) {
        this.modalSubscription.unsubscribe();
      }
  
      const modalRef = this.modalService.open(RoomEditComponent, { size: 'lg', centered: true });
      (<RoomEditComponent>modalRef.componentInstance).room = null;
      this.modalSubscription = from(modalRef.result).subscribe(
        (response: { confirmed: boolean } ) =>
        {
          if (response.confirmed)
          {
            this.notifyUpdateSuccess();
            this.getFilterRooms(this.currentPage);
          }
        }
      );
    }

    EditRoom() {

      if(!this.selectedRoom)
      {
        var message: string = this.currentLang == "es" ? "Seleccione la sala." : "Select room.";
        this.messageService.generalMessage(false, message);
        return;
      }
  
      if (this.modalSubscription) {
        this.modalSubscription.unsubscribe();
      }
      
      const modalRef = this.modalService.open(RoomEditComponent, { size: 'lg', centered: true });
      (<RoomEditComponent>modalRef.componentInstance).room = this.selectedRoom;
      this.modalSubscription = from(modalRef.result).subscribe(
        (response: { confirmed: boolean }) =>
        {
          if (response.confirmed)
          {
            this.notifyUpdateSuccess();
            this.getFilterRooms(this.currentPage);
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
      filterActive: this.findActive ? "1" : "",
      filterAvailable: this.findAvailable  ? "1" : "",
      filterProperty: ""
    };

    this.getFilterRooms(0);
  }

  RemoveRoom() {

    Swal({
      title:  this.currentLang == "es" ? "¿Está seguro?" : "Are you sure?",
      text: this.currentLang == "es" ? "Una vez borrada la sala no se podrá recuperar." : "Once deleted, you will not be able to recover this room!",
      icon: "warning",
      buttons:{cancel:true,confirm:true},
      dangerMode:true,
    })
    .then((willDelete) => {
      if (willDelete) {
        if(!this.selectedRoom)
        {
          var message: string = this.currentLang == "es" ? "Seleccione la sala." : "Select room.";
          this.messageService.generalMessage(false, message);
          return;
        }
    
        if (this.roomsSubscription) {
          this.roomsSubscription.unsubscribe();
        }
    
        this.roomsSubscription = this.adminService.deleteRoom(this.selectedRoom.id)
          .subscribe(
            (response: { result: boolean }) => {
              if (response.result) {
                Swal(this.currentLang == "es" ? "La sala ha sido borrada." :"The room has been deleted!", {
                  icon: "success",
                });
                this.notifyUpdateSuccess();
                this.getFilterRooms(this.currentPage);
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
