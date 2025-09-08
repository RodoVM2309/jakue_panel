import { EstadoDescargaModule } from './estado-descarga.module';

describe('EstadoDescargaModule', () => {
  let estadoDescargaModule: EstadoDescargaModule;

  beforeEach(() => {
    estadoDescargaModule = new EstadoDescargaModule();
  });

  it('should create an instance', () => {
    expect(estadoDescargaModule).toBeTruthy();
  });
});
