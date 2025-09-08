import { CcppModule } from './ccpp.module';

describe('CcppModule', () => {
  let ccppModule: CcppModule;

  beforeEach(() => {
    ccppModule = new CcppModule();
  });

  it('should create an instance', () => {
    expect(ccppModule).toBeTruthy();
  });
});
