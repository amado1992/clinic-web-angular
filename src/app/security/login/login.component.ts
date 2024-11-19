import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { faEyeSlash, faEye, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  faEyeSlashIcon = faEyeSlash;
  faEyeIcon = faEye;
  faWarningIcon = faExclamationTriangle;
  username: string;
  password: string;
  translated: boolean;
  message: string;
  language: string;
  waitingResponse: boolean;
  connection_error: string;
  showPassword: boolean;

  redirectUrl: string;
  queryParamsSubscription: Subscription;

  loadDataSubscription: Subscription;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private loginService: LoginService,
    private preferences: UserPreferencesService,
    private messageService: MessageService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
    this.translated = true;
    this.language = 'en';
    this.translate.use(this.language);
    this.showPassword = false;
    this.hookQueryParams();
  }

  ngOnDestroy() {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }

    if (this.loadDataSubscription) {
      this.loadDataSubscription.unsubscribe();
    }
  }

  submit() {

    if (this.loadDataSubscription) {
      this.loadDataSubscription.unsubscribe();
    }

    this.waitingResponse = true;
    this.message = null;
    this.connection_error = null;
    this.preferences.setUserLanguage(this.language);
    this.loadDataSubscription = this.loginService.login(this.username, this.password).subscribe((response: any) => 
    {
      if (!this.loginService.isHavePermission("Manage Employees"))
      {
        var message: string = this.language == "es" ? "El usuario no cuenta con el permiso necesario." : "The user does not have the necessary permission.";
        this.messageService.generalMessage(false, message);
        this.waitingResponse = false;
      }
      else
      {        
        this.loadImage();
      }

    },
      (error) => {
        this.waitingResponse = false;
        if (error.error.message) {
          this.message = error.error.message[this.language.toUpperCase()];
        } else {
          this.connection_error = 'commons.connection-error';
        }
      });
  }

  loadImage() {

    if (this.loadDataSubscription) {
      this.loadDataSubscription.unsubscribe();
    }

    this.loadDataSubscription = this.loginService.loadImage().subscribe((response: any) => {

      this.waitingResponse = false;
      if (!this.redirectUrl) {
        this.router.navigate(['app', 'dashboard']);
      } else {
        this.router.navigateByUrl(this.redirectUrl);
      }
    },
      (error) => {
        this.waitingResponse = false;
        if (!this.redirectUrl) {
          this.router.navigate(['app', 'dashboard']);
        } else {
          this.router.navigateByUrl(this.redirectUrl);
        }
      });
  }

  changeLanguage() {
    this.translated = !this.translated;
    if (this.translated) {
      this.language = 'en';
    } else {
      this.language = 'es';
    }
    this.translate.use(this.language);
  }

  private hookQueryParams(): void {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
    this.queryParamsSubscription = this.route.queryParamMap.subscribe(
      (data: ParamMap) => {
        this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
      }
    );
  }
}

