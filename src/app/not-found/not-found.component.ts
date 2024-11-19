import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { UserPreferencesService } from '../services/user-preferences.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  faExclamationIcon = faExclamationTriangle;

  constructor(private router: Router,
    private translateService: TranslateService,
    private userPreferences: UserPreferencesService) { }

  ngOnInit() {
    const langPreferred = this.userPreferences.getUserLanguage();
    if (langPreferred) {
      this.translateService.reloadLang(langPreferred);

    } else {
      this.translateService.reloadLang('es');

    }
  }

  goHome(): void {
    this.router.navigate(['app', 'dashboard']);
  }
}
