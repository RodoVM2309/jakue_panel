import { TestBed, async, inject } from '@angular/core/testing';

import { CentroAuthGuard } from './centro-auth.guard';

describe('CentroAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CentroAuthGuard]
    });
  });

  it('should ...', inject([CentroAuthGuard], (guard: CentroAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
