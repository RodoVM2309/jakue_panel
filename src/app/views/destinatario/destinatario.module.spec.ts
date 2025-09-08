import { DestinatarioModule } from './destinatario.module';

describe('DestinatarioModule', () => {
  let destinatarioModule: DestinatarioModule;

  beforeEach(() => {
    destinatarioModule = new DestinatarioModule();
  });

  it('should create an instance', () => {
    expect(destinatarioModule).toBeTruthy();
  });
});
