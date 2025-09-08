import { AsignarViajeModule } from './asignar-viaje.module';

describe('AsignarViajeModule', () => {
  let asignarViajeModule: AsignarViajeModule;

  beforeEach(() => {
    asignarViajeModule = new AsignarViajeModule();
  });

  it('should create an instance', () => {
    expect(asignarViajeModule).toBeTruthy();
  });
});
