import { AppNgbModule } from './app-ngb.module';

describe('NgbModule', () => {
  let ngbModule: AppNgbModule;

  beforeEach(() => {
    ngbModule = new AppNgbModule();
  });

  it('should create an instance', () => {
    expect(ngbModule).toBeTruthy();
  });
});
