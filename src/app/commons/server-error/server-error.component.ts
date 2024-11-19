import { Component, Input } from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent {

  exclamationIcon = faExclamationTriangle;
  @Input() error: HttpErrorResponse | any;
}
