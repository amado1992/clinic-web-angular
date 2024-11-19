import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolEditComponent } from './rol-edit.component';

describe('RolEditComponent', () => {
  let component: RolEditComponent;
  let fixture: ComponentFixture<RolEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
