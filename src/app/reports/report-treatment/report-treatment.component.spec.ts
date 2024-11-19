import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTreatmentComponent } from './report-treatment.component';

describe('ReportTreatmentComponent', () => {
  let component: ReportTreatmentComponent;
  let fixture: ComponentFixture<ReportTreatmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTreatmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
