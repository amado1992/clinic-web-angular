import {
  Component, OnDestroy, OnInit,
} from '@angular/core';
import { HomeSidebarService } from '../services/home-sidebar.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppHomeComponent implements OnInit, OnDestroy {
  sideBarState = true;
  stateSubscription: Subscription;
  sidebarBuildSubscription: Subscription;

  buildingSidebar: boolean;
  errorBuildingSidebar: boolean;
  error: HttpErrorResponse;

  constructor(private sideBarService: HomeSidebarService) {
  }

  ngOnInit() {
    this.stateSubscription = this.sideBarService.sideBarHide.subscribe(
      (state: boolean) => {
        this.sideBarState = state;
      });
    this.getSidebarConfiguration();
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
    if (this.sidebarBuildSubscription) {
      this.sidebarBuildSubscription.unsubscribe();
    }
  }

  private getSidebarConfiguration(): void {
    this.buildingSidebar = true;
    this.sidebarBuildSubscription = this.sideBarService.setSidebarConfiguration()
      .subscribe(
        (data: any) => {
          this.buildingSidebar = false;
        },
        (error: any) => {
          this.error = error;
          this.buildingSidebar = false;
          this.errorBuildingSidebar = true;
        }
      );
  }
}
