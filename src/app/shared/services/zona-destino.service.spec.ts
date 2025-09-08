import { TestBed, inject } from '@angular/core/testing';

import { ZonaDestinoService } from './zona-destino.service';

describe('ZonaDestinoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZonaDestinoService]
    });
  });

  it('should be created', inject([ZonaDestinoService], (service: ZonaDestinoService) => {
    expect(service).toBeTruthy();
  }));
});
