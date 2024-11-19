import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  faChartArea, faCog
} from '@fortawesome/free-solid-svg-icons';
import { map, tap } from 'rxjs/operators';

import { ComponentClickedButton } from '../models/componentClickedButton';
import { environment } from 'src/environments/environment';
import { SidebarConfig } from '../models/sidebar-config.interface';
import {log} from 'util';

@Injectable({
  providedIn: 'root'
})
export class HomeSidebarService {
  toggled = true;
  sideBarHide = new EventEmitter<boolean>();
  componentNew: BehaviorSubject<ComponentClickedButton> = new BehaviorSubject<ComponentClickedButton>(null);

  menus = [];
  actualState = true;
  private sidebarConfig: SidebarConfig;

  constructor(
    private http: HttpClient) {
    this.getReports();
  }

  toggle() {
    this.toggled = !this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
    this.sideBarHide.emit(this.toggled);
  }

  getMenuList() {
    return this.menus;
  }

  createNewComponent(componentClicked: ComponentClickedButton) {
    this.componentNew.next(componentClicked);
  }

  public setSidebarConfiguration(): Observable<boolean> {
    return of({admin : true})
      .pipe(
        tap((config: SidebarConfig) => this.saveConfig(config)),
        map((config: SidebarConfig) => this.buildSideBar()),
        map(() => true)
      );
  }

  private saveConfig(config: SidebarConfig): void {
    this.sidebarConfig = { ...config };
  }

  private buildSideBar(): void {

   /// console.log(sidebarConfiguration,'sidebarconfig');

    const adminSubMenu = this.buildAdministrationSubMenu(this.sidebarConfig);

    const reportSubMenu = this.buildReportSubMenu(this.sidebarConfig);
    this.menus = [
      {
        title: 'header-sidebar.dashboard',
        icon: faChartArea,
        link: 'app/dashboard',
        type: 'header',
        id: 'dashboard'
      }
    ];
    if (adminSubMenu) {
      this.menus.push(adminSubMenu);
    }

    if (reportSubMenu) {
      this.menus.push(reportSubMenu);
    }
    console.log('esto que essssssssssss',this.menus)
  }

  private buildAdministrationSubMenu(sidebarConfiguration: SidebarConfig): any {
    const adminSubMenu: { id: string, title: string, icon: any, type: string, badge: any, submenus: any[] } = {
      title: 'home.administration',
      icon: faCog,
      type: 'dropdown',
      id: 'administration',
      badge: {
        text: '30',
        class: 'badge-danger'
      },
      submenus: []
    };

    if (sidebarConfiguration.admin)
    {
      adminSubMenu.submenus.push(
        {
          title: 'home.ad_employees',
          link: 'app/admin/employees',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.ad_rols',
          link: 'app/admin/rols',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.ad_permissions',
          link: 'app/admin/permissions',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.ad_branchs',
          link: 'app/admin/branchs',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.ad_rooms',
          link: 'app/admin/rooms',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.ad_services',
          link: 'app/admin/services',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.ad_devices',
          link: 'app/admin/devices',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.ad_classificators',
          link: 'app/admin/classificators',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.ad_encoders',
          link: 'app/admin/encoders',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.company',
          link: 'app/admin/companys',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.ad_payments',
          link: 'app/admin/payments',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.ad_dates',
          link: 'app/admin/dates',
          type: 'simple'
        }
      );

      adminSubMenu.submenus.push(
        {
          title: 'home.report_daily_setting',
          link: 'app/admin/report',
          type: 'simple'
        }
      );
    }

    return adminSubMenu.submenus.length === 0 ? null : adminSubMenu;
  }

  private buildReportSubMenu(sidebarConfiguration: SidebarConfig): any {
    const reportSubMenu: { id: string, title: string, icon: any, type: string, badge: any, submenus: any[] } = {
      title: 'home.reports',
      icon: faCog,
      type: 'dropdown',
      id: 'report',
      badge: {
        text: '30',
        class: 'badge-danger'
      },
      submenus: []
    };

    if (sidebarConfiguration.admin)
    {


      // comentado 22/9/2023
      /*  reportSubMenu.submenus.push(
          {
            title: 'home.report_treatment',
            link: 'app/report/treatment',
            type: 'simple'
          }
        ); */
       // comentado 22/9/2023
       /* reportSubMenu.submenus.push(
          {
            title: 'home.report_assistance',
            link: 'app/report/assistance',
            type: 'simple'
          }
        );*/
        /*reportSubMenu.submenus.push(
          {
            title: 'home.report_patient_daily',
            link: 'app/report/patient',
            type: 'simple'
          }
        );*/

        //New report 
        reportSubMenu.submenus.push(
          {
            title: 'home.report_daily',
            link: 'app/report/daily',
            type: 'simple'
          }
        );
        reportSubMenu.submenus.push(
          {
            title: 'home.report_patient_list',
            link: 'app/report/patient_list',
            type: 'simple'
          }
        );
        reportSubMenu.submenus.push(
          {
            title: 'home.report_tip',
            link: 'app/report/tip',
            type: 'simple'
          }
        );

    }

    return reportSubMenu.submenus.length === 0 ? null : reportSubMenu;
  }

  getReports():Observable<any>{
     return this.http.get(environment.urls.getReportList)
  }
}
