import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PressKeyActionComponent } from './press-key-action.component';

describe('PressKeyActionComponent', () => {
  let component: PressKeyActionComponent;
  let fixture: ComponentFixture<PressKeyActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PressKeyActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PressKeyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
