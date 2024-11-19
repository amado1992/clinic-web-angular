import { AppHomeModule } from './app-home.module';

describe('AppHomeModule', () => {
  let appHomeModule: AppHomeModule;

  beforeEach(() => {
    appHomeModule = new AppHomeModule();
  });

  it('should create an instance', () => {
    expect(appHomeModule).toBeTruthy();
  });
});
