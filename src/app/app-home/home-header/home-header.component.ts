import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { faLanguage, faBell, faSignOutAlt, faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons';

import { LoginService } from '../../services/login.service';
import { HomeSidebarService } from '../../services/home-sidebar.service';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { MessageService } from '../../services/message.service';
import { PageFindData } from '../../models/pageFindData.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit, OnDestroy {
  faBarsIcon = faBars;
  faLanguageIcon = faLanguage;
  faBellIcon = faBell;
  faSignOutIcon = faSignOutAlt;
  faUserCircleIcon = faUserCircle;
  username: string;
  colorEs: string;
  colorEn: string;
  userImage: any;
  language: string;
  alertNumber = 0;
  bellDataChangeSubscription: Subscription;

  logOutSubscription: Subscription;

  constructor(private translate: TranslateService,
    private login: LoginService,
    private router: Router,
    private sideBarService: HomeSidebarService,
    private userPreferencesService: UserPreferencesService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.setLanguage();
    this.setUsername();
    this.setUserImage();
  }

  ngOnDestroy() {
    if (this.bellDataChangeSubscription) {
      this.bellDataChangeSubscription.unsubscribe();
    }

    if (this.logOutSubscription) {
      this.logOutSubscription.unsubscribe();
    }
  }

  hideSideBar() {
    const sideBarState = this.sideBarService.getSidebarState();
    this.sideBarService.setSidebarState(!sideBarState);
  }

  changeLanguage(len: string) {
    this.translate.use(len);
    this.userPreferencesService.setUserLanguage(len);
    if(len=='en'){
        this.colorEn ='black';
        this.colorEs = 'gray';
    } else {
      this.colorEn ='gray';
      this.colorEs = 'black';
    }
    window.location.reload()
  }

  logout() {

    this.logOutSubscription = this.login.logout().subscribe(
      (response: any) => {
        this.router.navigate(['/login']);
      },
      (error) => {

      });
  }

  private setUsername(): void {
    this.username = this.userPreferencesService.getUsername();
  }

  private setUserImage(): void {    
    this.userImage = this.userPreferencesService.getUserImage();

    if(this.userImage != 'null')
    {
      this.userImage = 'data:image/' + 'png' + ';base64,' + this.userImage;
    }
  }

  private setLanguage(): void {
    if (!this.translate.currentLang) {
      const lang = this.userPreferencesService.getUserLanguage();
      const missingLang = lang ? !this.translate.getLangs().find((value: string) => value === lang) : false;
      if (!lang || missingLang) {
        this.translate.use('en');
      } else {
        this.translate.use(lang);
      }

      if (missingLang) {
        this.messageService.generalMessage(false, 'Your preferred language is not available. English will be used instead');
      }
    }
    this.language = this.translate.currentLang;
    if(this.language=='en'){
      this.colorEn ='black';
      this.colorEs = 'gray';
  } else {
    this.colorEn ='gray';
    this.colorEs = 'black';
  }
  }
}
