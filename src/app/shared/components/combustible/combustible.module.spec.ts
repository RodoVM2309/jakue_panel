import { CombustibleModule } from './combustible.module';

describe('CombustibleModule', () => {
  let combustibleModule: CombustibleModule;

  beforeEach(() => {
    combustibleModule = new CombustibleModule();
  });

  it('should create an instance', () => {
    expect(combustibleModule).toBeTruthy();
  });
});
