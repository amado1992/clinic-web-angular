import { ReportRoutingModule } from './report-routing.module';

describe('ReportRoutingModule', () => {
  let reportRoutingModule: ReportRoutingModule;

  beforeEach(() => {
    reportRoutingModule = new ReportRoutingModule();
  });

  it('should create an instance', () => {
    expect(reportRoutingModule).toBeTruthy();
  });
});
