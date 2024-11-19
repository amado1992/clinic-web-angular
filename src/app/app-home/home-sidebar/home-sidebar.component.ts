import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { any } from 'codelyzer/util/function';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { HomeSidebarService } from '../../services/home-sidebar.service';
import { Router } from '@angular/router';
import { ComponentItem } from 'src/app/models/ComponentItem';
import { ComponentClickedButton } from 'src/app/models/componentClickedButton';
import { timeout, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class HomeSidebarComponent implements OnInit, OnDestroy {
  faCaretDownIcon = faCaretDown;
  menus = [];
  language: string;
  private langSubscription: Subscription;
  menuState: any = {};

  constructor(private sideBarService: HomeSidebarService,
    private translateService: TranslateService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.hookLanguageChanges();
    var href = this.router.url;
    //alert(href);
    if (href=='/app/dashboard'){
      this.sideBarService.getReports()
      .subscribe(res=>console.log(res));
    }
    //this.sideBarService.getReports().subscribe(res=>console.log(res));
    this.menus = this.sideBarService.getMenuList();
    console.log("Menus... ", this.menus)
    this.menus.forEach(
      (item) => {
        if (item.type === 'dropdown') {
          this.menuState[item.id] = false;
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  menuItemClick(menuItem) {
    this.router.navigateByUrl(menuItem.link);
  }


  getState(currentMenu) {
    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  clickedSubMenu(subMenu) {
    if (subMenu.action === 'createComponent') {
     
      let component: ComponentItem;
      if (subMenu.idCategory) {
        component = new ComponentItem(any, subMenu.title, true, subMenu.idCategory, subMenu.canCirculate);
      }
      const componentClicked: ComponentClickedButton = new ComponentClickedButton(subMenu.title, component);
      this.sideBarService.createNewComponent(componentClicked);
    }
    var lastoption=document.getElementById("lastoption").innerText;
    if(lastoption.length!==0){
      //alert(lastoption);
      document.getElementById(lastoption).className = "";
    }
    document.getElementById("lastoption").innerText=subMenu.title;
    var newOption = document.getElementById("lastoption").innerText;
    document.getElementById(newOption).className = "activo";
    
    //alert(subMenu.title);
    this.router.navigateByUrl(subMenu.link);
  }

  private hookLanguageChanges() {
    this.language = this.translateService.currentLang;
    this.langSubscription = this.translateService.onLangChange.subscribe(
      (langChangeEvent: LangChangeEvent) => {
        this.language = langChangeEvent.lang;
        console.log("Language www ", this.language)
      }
    );
  }
}
