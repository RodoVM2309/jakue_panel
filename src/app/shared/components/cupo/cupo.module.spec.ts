import { CupoModule } from './cupo.module';

describe('CupoModule', () => {
  let cupoModule: CupoModule;

  beforeEach(() => {
    cupoModule = new CupoModule();
  });

  it('should create an instance', () => {
    expect(cupoModule).toBeTruthy();
  });
});
