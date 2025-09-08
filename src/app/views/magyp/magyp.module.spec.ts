import { MagypModule } from './magyp.module';

describe('MagypModule', () => {
  let magypModule: MagypModule;

  beforeEach(() => {
    magypModule = new MagypModule();
  });

  it('should create an instance', () => {
    expect(magypModule).toBeTruthy();
  });
});
