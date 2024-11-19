import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncoderListComponent } from './encoder-list.component';

describe('EncoderListComponent', () => {
  let component: EncoderListComponent;
  let fixture: ComponentFixture<EncoderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncoderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncoderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
