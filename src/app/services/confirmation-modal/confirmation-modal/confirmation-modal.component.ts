import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() modalTitle: string;
  @Input() modalQuestion: string;

  constructor(private activeModel: NgbActiveModal) { }

  ngOnInit() {
  }

  confirm() {
    this.activeModel.close({confirmed: true});
  }

  cancel() {
    this.activeModel.close({confirmed: false});
  }
}
