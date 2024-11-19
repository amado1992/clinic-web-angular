import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDatesComponent } from './admin-dates.component';

describe('AdminDatesComponent', () => {
  let component: AdminDatesComponent;
  let fixture: ComponentFixture<AdminDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
