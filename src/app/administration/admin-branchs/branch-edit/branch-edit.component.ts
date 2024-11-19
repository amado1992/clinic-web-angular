import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Rama } from 'src/app/models/rama.model';
import { MessageService } from 'src/app/services/message.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-branch-edit',
  templateUrl: './branch-edit.component.html',
  styleUrls: ['./branch-edit.component.scss']
})
export class BranchEditComponent implements OnInit, OnDestroy {

  faCogIcon = faCog;

  branchForm: FormGroup;
  
  @Input() branch: Rama;

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

    this.branchForm = this.fb.group(
      {
        id: [null],
        name: [null],
        description: [null],
        infoCheck: [null]
      }
    );

    this.branchForm.enable();

    if (this.branch) {
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

    this.branchForm.get('id').setValue(this.branch.id);
    this.branchForm.get('name').setValue(this.branch.nombre);
    this.branchForm.get('description').setValue(this.branch.descripcion);
  }
  onCheckboxAcceptChange(e) {

    this.creating = e.target.checked;
  }

  get disabled(): boolean {
    return false;
  }

  okUpdate() {

    this.updateData = true;

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    this.branch =
    {
      id: this.branchForm.get('id').value,
      nombre: this.branchForm.get('name').value,
      descripcion: this.branchForm.get('description').value
    };

    //actualizar
    this.dataSubscription = this.adminService.updateBranch(this.branch)
      .subscribe(
        (data: any) => {

          this.updateData = false;
          this.activeModal.close({ confirmed: true });
        },
        (error: HttpErrorResponse) => {

          this.notifyUpdateError(error);

          if(this.branchForm.get('id').value == null)
          {
            this.branch = null;
          }
          this.creating = false;
          this.updateData = false;
        }
      )
  }

  private notifyUpdateError(error: any) {
    this.messageService.wrongOperation(error.error.message);
  }

  cancelUpdate() {
    this.activeModal.close({ confirmed: false });
  }


}
