import { TurneadaModule } from './turneada.module';

describe('TurneadaModule', () => {
  let turneadaModule: TurneadaModule;

  beforeEach(() => {
    turneadaModule = new TurneadaModule();
  });

  it('should create an instance', () => {
    expect(turneadaModule).toBeTruthy();
  });
});
