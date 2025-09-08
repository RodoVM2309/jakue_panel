import { DocumentosModule } from './documentos.module';

describe('DocumentosModule', () => {
  let documentosModule: DocumentosModule;

  beforeEach(() => {
    documentosModule = new DocumentosModule();
  });

  it('should create an instance', () => {
    expect(documentosModule).toBeTruthy();
  });
});
