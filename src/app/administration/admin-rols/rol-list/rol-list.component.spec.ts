import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolListComponent } from './rol-list.component';

describe('RolListComponent', () => {
  let component: RolListComponent;
  let fixture: ComponentFixture<RolListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
