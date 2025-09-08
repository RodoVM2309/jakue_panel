import { TestBed, inject } from '@angular/core/testing';

import { DesvioMotivoService } from './desvio-motivo.service';

describe('DesvioMotivoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DesvioMotivoService]
    });
  });

  it('should be created', inject([DesvioMotivoService], (service: DesvioMotivoService) => {
    expect(service).toBeTruthy();
  }));
});
