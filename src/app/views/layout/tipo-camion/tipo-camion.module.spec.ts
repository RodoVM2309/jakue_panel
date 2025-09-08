import { TipoCamionModule } from './tipo-camion.module';

describe('TipoCamionModule', () => {
  let tipoCamionModule: TipoCamionModule;

  beforeEach(() => {
    tipoCamionModule = new TipoCamionModule();
  });

  it('should create an instance', () => {
    expect(tipoCamionModule).toBeTruthy();
  });
});
