import { TestBed, async, inject } from '@angular/core/testing';

import { MagypAuthGuard } from './magyp-auth.guard';

describe('MagypAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MagypAuthGuard]
    });
  });

  it('should ...', inject([MagypAuthGuard], (guard: MagypAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
