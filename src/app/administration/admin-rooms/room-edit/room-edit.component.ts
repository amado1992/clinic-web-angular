import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Sala } from 'src/app/models/sala.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss']
})
export class RoomEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;

  roomForm: FormGroup;
  
  @Input() room: Sala;

  currentLang: string;
  langSubscription: Subscription;

  updateData: boolean;

  dataSubscription: Subscription;

  creating = false;

  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal, private translateService: TranslateService,
    private messageService: MessageService, private adminService: AdminUsersService) { }
  
  ngOnInit() {
     this.hookLang();
     this.initForm();
  }

  ngOnDestroy() {

    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
  private initForm() {

    this.roomForm = this.fb.group(
      {
        id: [null],
        name: [null],
        description: [null],
        active: [null],
        available: [null],
        infoCheck: [null],
        opresentation:[null],
        version:[null],
      }
    );

    this.roomForm.enable();

    if (this.room) {
      this.initFormService();
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


  private initFormService() {

    this.roomForm.get('id').setValue(this.room.id);
    this.roomForm.get('name').setValue(this.room.nombre);
    this.roomForm.get('description').setValue(this.room.descripcion); 
    this.roomForm.get('active').setValue((this.room.activa && this.room.activa === "1") ? true : false); 
    this.roomForm.get('available').setValue((this.room.disponible && this.room.disponible === "1") ? true : false); 
    this.roomForm.get('opresentation').setValue(this.room.orden);
    this.roomForm.get('version').setValue(this.room.version);
  }
  onCheckboxAcceptChange(e) {

    this.creating = e.target.checked;
  }

  get disabled(): boolean {
    return false; //!this.selectedLaboratory;
  }

  okUpdate() {

    this.updateData = true;

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    var orderAvailable = localStorage.getItem("roomItems");
    //console.log("rooms"+orderAvailable);
    var myOrders = orderAvailable.split(",");
    var flagOrder = false;

    if((myOrders.indexOf(String(this.roomForm.get('opresentation').value))!=-1)
    &&  (this.room!=null)){
         if((String(this.room.orden) != String(this.roomForm.get('opresentation').value))){
             flagOrder = true;
         }
    }
    if(this.room==null){
      this.roomForm.get('version').setValue("0");  
      if((myOrders.indexOf(String(this.roomForm.get('opresentation').value))!=-1)){
        flagOrder=true;
      }
    }
    
    if(flagOrder){
      this.messageService.generalMessage(false,"Order not Available");
      this.creating = false;
      this.updateData = false;
    } else {

    this.room =
    {
      id: this.roomForm.get('id').value,
      nombre: this.roomForm.get('name').value,
      descripcion: this.roomForm.get('description').value,
      activa: this.roomForm.get('active').value ? "1" : "0",
      disponible: this.roomForm.get('available').value ? "1" : "0",
      orden: this.roomForm.get('opresentation').value,
      version: this.roomForm.get('version').value,
    };

    //actualizar
    this.dataSubscription = this.adminService.updateRoom(this.room)
      .subscribe(
        (data: any) => {

          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {

          this.notifyUpdateError(error);

          if(this.roomForm.get('id').value == null)
          {
            this.room = null;
          }
          this.creating = false;

          this.updateData = false;
        }
      )
    }
  }

  private notifyUpdateError(error: any) {
    this.messageService.wrongOperation(error.error.message);
  }

  cancelUpdate() {
    this.activeModal.close({ confirmed: false });
  }
}
