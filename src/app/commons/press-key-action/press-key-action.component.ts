import {Component, HostListener, Input} from '@angular/core';

@Component({
  selector: 'app-press-key-action',
  templateUrl: './press-key-action.component.html',
  styleUrls: ['./press-key-action.component.scss']
})
export class PressKeyActionComponent{
  @Input('keypress') keyPress: Array<string> = [];
  @Input('attrAction') attrAction: Array<HTMLElement> = [];

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.keyPress.indexOf(event.key) != -1) {
      this.attrAction.forEach((htmlElement: HTMLElement) => {
        htmlElement.click();
      });
    }
  }
}
