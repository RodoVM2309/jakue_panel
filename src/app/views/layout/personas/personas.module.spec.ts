import { PersonasModule } from './personas.module';

describe('PersonasModule', () => {
  let personasModule: PersonasModule;

  beforeEach(() => {
    personasModule = new PersonasModule();
  });

  it('should create an instance', () => {
    expect(personasModule).toBeTruthy();
  });
});
