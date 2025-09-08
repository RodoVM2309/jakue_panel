import { ZonaModule } from './zona.module';

describe('ZonaModule', () => {
  let zonaModule: ZonaModule;

  beforeEach(() => {
    zonaModule = new ZonaModule();
  });

  it('should create an instance', () => {
    expect(zonaModule).toBeTruthy();
  });
});
