import { TestBed, async, inject } from '@angular/core/testing';

import { MtrAuthGuard } from './mtr-auth.guard';

describe('MtrAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MtrAuthGuard]
    });
  });

  it('should ...', inject([MtrAuthGuard], (guard: MtrAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
