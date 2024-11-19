import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NotifierModule } from 'angular-notifier';
import { ArchwizardModule } from 'angular-archwizard';
import { ItemListBootstrapModule } from 'item-list-bootstrap';
import { ItemAssignmentBootstrapModule } from 'item-assignment-bootstrap';
import { PaginationModule } from 'utils-bootstrap';

import { AdminHomeComponent } from './admin-home.component';
import { GroupEditComponent } from '../admin-groups/group-edit/group-edit.component';
import { GroupCreateComponent } from '../admin-groups/group-create/group-create.component';
import { AdminAuthProviderComponent } from '../admin-auth-provider/admin-auth-provider.component';
import { GroupListComponent } from '../admin-groups/group-list/group-list.component';
import { GroupsAdminComponent } from '../admin-groups/groups-admin/groups-admin.component';
import { UserListComponent } from '../admin-users/user-list/user-list.component';
import { UsersAdminComponent } from '../admin-users/users-admin/users-admin.component';
import { ComputerAdmComponent } from '../computer-adm/computer-adm.component';
import { UserCreateComponent } from '../admin-users/user-create/user-create.component';
import { PrincipalPageComponent } from '../entity-adm/principal-page/principal-page.component';
import { ListAssignmentCreateComponent } from '../admin-users/list-assignment/list-assignment-create/list-assignment-create.component';
import { ContactFormComponent } from '../commons/contact-form/contact-form.component';
import { TimeFormComponent } from '../entity-adm/time-form/time-form.component';
import { WeekDaysSelectorComponent } from '../entity-adm/week-days-selector/week-days-selector.component';
import { TimeListComponent } from '../admin-users/time-list/time-list.component';
import { EntityAdminComponent } from '../entity-adm/entity-admin/entity-admin.component';
import { UserEditComponent } from '../admin-users/user-edit/user-edit.component';
import { ListsAdminComponent } from '../lists-adm/lists-admin.component';
import { GeneralDataComponent } from '../lists-adm/administration/general-data/general-data.component';
import { DepartmentAdminComponent } from '../entity-adm/department-admin/department-admin.component';
import { GroupOverviewComponent } from '../admin-groups/group-overview/group-overview.component';
import { EntityOverviewComponent } from '../entity-adm/entity-overview/entity-overview.component';
import { CirculationReasonAdminComponent } from '../circulation-reason-adm/circulation-reason-admn.component';
import { GeneralDataReasonComponent } from '../circulation-reason-adm/general-data/general-data-reason.component';
import { ListActionAssignmentComponent } from '../admin-users/list-action-assignment/list-action-assignment.component';
import { AdministrationComponent } from '../lists-adm/administration/administration.component';
import { OperationsComponent } from '../lists-adm/operations/operations.component';
import { ImportListComponent } from '../lists-adm/operations/import-list/import-list.component';
import { ExportListComponent } from '../lists-adm/operations/export-list/export-list.component';
import { AnimatedCheckComponent } from '../admin-users/animated-check/animated-check.component';
import { InstructionAdminComponent } from '../admin-instructions/instruction-admin/instruction-admin.component';
import { InstructionListComponent } from '../admin-instructions/instruction-list/instruction-list.component';
import { InstructionCreateComponent } from '../admin-instructions/instruction-create/instruction-create.component';
import { InstructionEditComponent } from '../admin-instructions/instruction-edit/instruction-edit.component';
import { ListAssignmentComponent } from '../admin-users/list-assignment/assignment/list-assignment.component';
import { ListAssignmentEditComponent } from '../admin-users/list-assignment/list-assignment-edit/list-assignment-edit.component';
import { AppNgbModule } from '../../ngb/app-ngb.module';
import { AdministrationRoutingModule } from '../administration-routing/administration-routing.module';
import { CommonsModule } from '../../commons/commons.module';
import { AdminAuthProviderService } from '../../services/admin-auth-provider.service';
import { AuthProviderAdapter } from '../../services/adapters/auth-provider.adapter';
import { AdminGroupsService } from '../../services/admin-groups.service';
import { GroupAdapter } from '../../services/adapters/group.adapter';
import { GroupTreeAdapter } from '../../services/adapters/group-tree.adapter';


function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

describe('AdminHomeComponent', () => {
  let component: AdminHomeComponent;
  let fixture: ComponentFixture<AdminHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupEditComponent,
        GroupCreateComponent,
        AdminAuthProviderComponent,
        AdminHomeComponent,
        GroupListComponent,
        GroupsAdminComponent,
        UserListComponent,
        UsersAdminComponent,
        ComputerAdmComponent,
        UserCreateComponent,
        AdminAuthProviderComponent,
        PrincipalPageComponent,
        ListAssignmentCreateComponent,
        ContactFormComponent,
        TimeFormComponent,
        WeekDaysSelectorComponent,
        TimeListComponent,
        EntityAdminComponent,
        UserEditComponent,
        ListsAdminComponent,
        GeneralDataComponent,
        DepartmentAdminComponent,
        GroupOverviewComponent,
        EntityOverviewComponent,
        CirculationReasonAdminComponent,
        GeneralDataReasonComponent,
        ListActionAssignmentComponent,
        AdministrationComponent,
        OperationsComponent,
        ImportListComponent,
        ExportListComponent,
        AnimatedCheckComponent,
        InstructionAdminComponent,
        InstructionListComponent,
        InstructionCreateComponent,
        InstructionEditComponent,
        ListAssignmentComponent,
        ListAssignmentEditComponent
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        NotifierModule.withConfig({
          position: {
            horizontal: {
              position: 'right',
              distance: 12
            },
            vertical: {
              position: 'bottom',
              distance: 60,
              gap: 10
            }
          },
          behaviour: {
            autoHide: 1500,
            onClick: 'hide',
            onMouseover: 'pauseAutoHide',
            showDismissButton: true,
            stacking: 4
          }
        }),
        CommonModule,
        AppNgbModule,
        AdministrationRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        ArchwizardModule,
        CommonsModule,
        ItemListBootstrapModule,
        ItemAssignmentBootstrapModule,
        PaginationModule,
        HttpClientModule,
        RouterModule.forRoot([])
      ],
      providers: [
        AdminAuthProviderService,
        AuthProviderAdapter,
        AdminGroupsService,
        GroupAdapter,
        GroupTreeAdapter,
        { provide: APP_BASE_HREF, useValue:'/'}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
