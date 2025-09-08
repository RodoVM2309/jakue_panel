import { TestBed, async, inject } from '@angular/core/testing';

import { TranspAuthGuard } from './transp-auth.guard';

describe('TranspAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranspAuthGuard]
    });
  });

  it('should ...', inject([TranspAuthGuard], (guard: TranspAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
