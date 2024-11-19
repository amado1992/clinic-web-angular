import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncoderEditComponent } from './encoder-edit.component';

describe('EncoderEditComponent', () => {
  let component: EncoderEditComponent;
  let fixture: ComponentFixture<EncoderEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncoderEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncoderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
