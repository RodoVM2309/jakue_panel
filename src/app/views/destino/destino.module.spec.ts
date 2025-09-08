import { DestinoModule } from './destino.module';

describe('DestinoModule', () => {
  let destinoModule: DestinoModule;

  beforeEach(() => {
    destinoModule = new DestinoModule();
  });

  it('should create an instance', () => {
    expect(destinoModule).toBeTruthy();
  });
});
