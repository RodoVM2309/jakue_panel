import { TestBed, inject } from '@angular/core/testing';

import {RazonRechazoService } from './razon-rechazo.service';

describe('DesvioMotivoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RazonRechazoService]
    });
  });

  it('should be created', inject([RazonRechazoService], (service: RazonRechazoService) => {
    expect(service).toBeTruthy();
  }));
});
