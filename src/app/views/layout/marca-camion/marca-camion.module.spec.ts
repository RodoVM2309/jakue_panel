import { MarcaCamionModule } from './marca-camion.module';

describe('MarcaCamionModule', () => {
  let marcaCamionModule: MarcaCamionModule;

  beforeEach(() => {
    marcaCamionModule = new MarcaCamionModule();
  });

  it('should create an instance', () => {
    expect(marcaCamionModule).toBeTruthy();
  });
});
