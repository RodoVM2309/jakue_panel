import { MarcaAcopladoModule } from './marca-acoplado.module';

describe('MarcaAcopladoModule', () => {
  let marcaAcopladoModule: MarcaAcopladoModule;

  beforeEach(() => {
    marcaAcopladoModule = new MarcaAcopladoModule();
  });

  it('should create an instance', () => {
    expect(marcaAcopladoModule).toBeTruthy();
  });
});
