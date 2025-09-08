import { DadorModule } from './dador.module';

describe('DadorModule', () => {
  let dadorModule: DadorModule;

  beforeEach(() => {
    dadorModule = new DadorModule();
  });

  it('should create an instance', () => {
    expect(dadorModule).toBeTruthy();
  });
});
