import { AcopladoModule } from './acoplado.module';

describe('AcopladoModule', () => {
  let acopladoModule: AcopladoModule;

  beforeEach(() => {
    acopladoModule = new AcopladoModule();
  });

  it('should create an instance', () => {
    expect(acopladoModule).toBeTruthy();
  });
});
