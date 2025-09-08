import { TestBed, async, inject } from '@angular/core/testing';

import { DadorAuthGuard } from './dador-auth.guard';

describe('DadorAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DadorAuthGuard]
    });
  });

  it('should ...', inject([DadorAuthGuard], (guard: DadorAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
