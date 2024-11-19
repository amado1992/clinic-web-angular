import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { Confirmation } from './confirmation.model';

@Injectable()
export class ConfirmationModalService {

  constructor(private modalService: NgbModal) { }

  showConfirmationModal(modalTitle: string, modalQuestion: string, centered: boolean = true): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {centered: centered});
    modalRef.componentInstance.modalTitle = modalTitle;
    modalRef.componentInstance.modalQuestion = modalQuestion;

    return modalRef.result.then(
      (response: Confirmation) => response.confirmed
    );
  }
}
