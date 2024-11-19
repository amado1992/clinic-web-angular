import { SecurityRoutingModule } from './security-routing.module';

describe('DashboardRoutingModule', () => {
  let securityRoutingModule: SecurityRoutingModule;

  beforeEach(() => {
    securityRoutingModule = new SecurityRoutingModule();
  });

  it('should create an instance', () => {
    expect(securityRoutingModule).toBeTruthy();
  });
});
