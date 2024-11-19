import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificatorEditComponent } from './classificator-edit.component';

describe('ClassificatorEditComponent', () => {
  let component: ClassificatorEditComponent;
  let fixture: ComponentFixture<ClassificatorEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificatorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificatorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
