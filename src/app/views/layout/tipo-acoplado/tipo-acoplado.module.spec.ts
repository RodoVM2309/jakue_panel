import { TipoAcopladoModule } from './tipo-acoplado.module';

describe('TipoAcopladoModule', () => {
  let tipoAcopladoModule: TipoAcopladoModule;

  beforeEach(() => {
    tipoAcopladoModule = new TipoAcopladoModule();
  });

  it('should create an instance', () => {
    expect(tipoAcopladoModule).toBeTruthy();
  });
});
