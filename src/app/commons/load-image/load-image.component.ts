import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-load-image',
  templateUrl: './load-image.component.html',
  styleUrls: ['./load-image.component.scss']
})
export class LoadImageComponent {
  @Output() selectedFile = new EventEmitter<File>();

  @Input() loadTooltip;
  @Input() clearTooltip;

  faPictureIcon = faImage;
  faCloseIcon = faTimes;

  constructor( translate: TranslateService){}

  onFileChanged(event) {

    if (event.target.files[0])
    {
      const reader = new FileReader();
      reader.onloadend = (e: Event) => {
        this.selectedFile.emit(reader.result.split(',')[1]);
      };  

      reader.readAsDataURL(event.target.files[0]);  
    }
  }
  remove()
  {
    this.selectedFile.emit(null);
  }

}
