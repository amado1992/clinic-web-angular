import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Clinica';

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.registerAvailableLanguages();
  }

  private registerAvailableLanguages(): void {
    this.translateService.addLangs(['es', 'en']);
  }
}
