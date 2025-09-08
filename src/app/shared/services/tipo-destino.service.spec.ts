import { TestBed, inject } from '@angular/core/testing';

import { TipoDestinoService } from './tipo-destino.service';

describe('TipoDestinoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoDestinoService]
    });
  });

  it('should be created', inject([TipoDestinoService], (service: TipoDestinoService) => {
    expect(service).toBeTruthy();
  }));
});
