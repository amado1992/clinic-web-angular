
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { SettingRD } from 'src/app/models/settingRD';
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.scss']
})
export class AdminReportComponent implements OnInit {

  faCogIcon = faCog;
  currentLang: string;
  langSubscription: Subscription;
  settingRDSubscription: Subscription;
  settingRDForm:  FormGroup;
  settingRD: SettingRD;
  loadingSettingRD:boolean;
  errorLoadingSettingRD:boolean;
  totalItems = 0;
  items: any;
  constructor(private fb: FormBuilder, private translateService: TranslateService, private messageService: MessageService,
    private adminService: AdminUsersService, private userPreferences: UserPreferencesService) { }
  
 

  ngOnInit() {
    this.hookLang();
    this.initForm();
    this.getSettingsRD();
    
   
  }

  private initForm() {

    this.settingRDForm = this.fb.group(
      {
        email: [null],
        hora: [null],
        minutos: [null],
        lunes: [null],
        martes: [null],
        miercoles: [null],
        jueves: [null],
        viernes:[null],
        sabado:[null],
        domingo:[null],
        id:[null],
      }
    );
    this.settingRDForm.enable();

  }
   
  private getSettingsRD() {

      if (this.settingRDSubscription) {
        this.settingRDSubscription.unsubscribe();
      }
  
      this.loadingSettingRD = true;
      this.errorLoadingSettingRD = false;
  
      this.settingRDSubscription = this.adminService.getSettingsRD()

        .subscribe(
          (response: {}) => {
            this.items = response;
           
   
            this.settingRD = this.items["settingsRD"];
            var sett = this.items["settingsRD"];       
           
            console.log("settings iniciales"+this.settingRD);
            if((this.settingRD) &&(this.items["settingsRD"].length>0)){
 
              this.settingRDForm.get('email').setValue(sett[0].email);
              this.settingRDForm.get('hora').setValue(sett[0].hora);
              this.settingRDForm.get('minutos').setValue(sett[0].minutos);
              this.settingRDForm.get('id').setValue(sett[0].id);
              var diassemana=sett[0].diassemana;
       
              if(String(diassemana).includes("1")){
                this.settingRDForm.get('lunes').setValue(true);

              }
              if(String(diassemana).includes("2")){
                this.settingRDForm.get('martes').setValue(true);

              }

              if(String(diassemana).includes("3")){
                this.settingRDForm.get('miercoles').setValue(true);

              }

              if(String(diassemana).includes("4")){
                this.settingRDForm.get('jueves').setValue(true);

              }

              if(String(diassemana).includes("5")){
                this.settingRDForm.get('viernes').setValue(true);

              }

              if(String(diassemana).includes("6")){
                this.settingRDForm.get('sabado').setValue(true);

              }

              if(String(diassemana).includes("7")){
                this.settingRDForm.get('domingo').setValue(true);

              }


 
          } else {


              this.settingRDForm.get('email').setValue("");
              this.settingRDForm.get('hora').setValue("");
              this.settingRDForm.get('minutos').setValue("");
              //this.settingRDForm.get('id').setValue("1");
              this.settingRDForm.get('lunes').setValue(false);
              this.settingRDForm.get('martes').setValue(false);
              this.settingRDForm.get('miercoles').setValue(false);
              this.settingRDForm.get('jueves').setValue(false);
              this.settingRDForm.get('viernes').setValue(false);
              this.settingRDForm.get('sabado').setValue(false);
              this.settingRDForm.get('domingo').setValue(false);
          }
          this.loadingSettingRD = false;
         
            
  
          },
          (error: HttpErrorResponse) => {
            this.loadingSettingRD = false;
            this.errorLoadingSettingRD = true;
  
            console.log("error: HttpErrorResponse")
            console.log(error)
  
            var message: string = this.currentLang == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
            this.messageService.generalMessage(false, message);
          }
        )
       
    }


    updateSetting() {

      if (this.settingRDSubscription) {
        this.settingRDSubscription.unsubscribe();
      }
  
      this.loadingSettingRD = true;
      this.errorLoadingSettingRD = false;
      var diassemana = "";
      if( this.settingRDForm.get('lunes').value){
        diassemana += "1,"
      }
      if( this.settingRDForm.get('martes').value){
        diassemana += "2,"
      }

      if( this.settingRDForm.get('miercoles').value){
        diassemana += "3,"
      }

      if( this.settingRDForm.get('jueves').value){
        diassemana += "4,"
      }
      if( this.settingRDForm.get('viernes').value){
        diassemana += "5,"
      }
      if( this.settingRDForm.get('sabado').value){
        diassemana += "6,"
      }

      if( this.settingRDForm.get('domingo').value){
        diassemana += "7,"
      }

      var idSetting=this.settingRDForm.get('id').value;
      if(idSetting==null){
        idSetting=1;
      }
      this.settingRD =
      {
        id: idSetting,
        email: this.settingRDForm.get('email').value,
        hora: this.settingRDForm.get('hora').value,
        minutos: this.settingRDForm.get('minutos').value,
       diassemana: diassemana
      };
  
      console.log(this.settingRD);
  
      this.settingRDSubscription = this.adminService.setSettingsRD(this.settingRD)
        .subscribe(
          (response: {}) => {
        
           this.loadingSettingRD=false;     

     

         
            
  
          },
          (error: HttpErrorResponse) => {
        
            this.loadingSettingRD=false;  
            this.errorLoadingSettingRD = true;
  
            console.log("error: HttpErrorResponse")
            console.log(error)
  
            var message: string = this.currentLang == "es" ? "No fue posible actualizar los datos." : "Data could not be updated.";
            this.messageService.generalMessage(false, message);
          }
        )
       
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



}
