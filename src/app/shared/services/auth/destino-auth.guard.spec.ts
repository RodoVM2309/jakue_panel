import { TestBed, async, inject } from '@angular/core/testing';

import { DestinoAuthGuard } from './destino-auth.guard';

describe('DestinoAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DestinoAuthGuard]
    });
  });

  it('should ...', inject([DestinoAuthGuard], (guard: DestinoAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
