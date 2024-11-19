import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificatorListComponent } from './classificator-list.component';

describe('ClassificatorListComponent', () => {
  let component: ClassificatorListComponent;
  let fixture: ComponentFixture<ClassificatorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificatorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
