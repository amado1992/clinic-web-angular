import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAssistanceComponent } from './report-assistance.component';

describe('ReportAssistanceComponent', () => {
  let component: ReportAssistanceComponent;
  let fixture: ComponentFixture<ReportAssistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAssistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
