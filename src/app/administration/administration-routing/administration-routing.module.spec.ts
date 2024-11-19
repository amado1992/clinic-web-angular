import { AdministrationRoutingModule } from './administration-routing.module';

describe('AdministrationRoutingModule', () => {
  let administrationRoutingModule: AdministrationRoutingModule;

  beforeEach(() => {
    administrationRoutingModule = new AdministrationRoutingModule();
  });

  it('should create an instance', () => {
    expect(administrationRoutingModule).toBeTruthy();
  });
});
