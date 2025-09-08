import { TestBed, inject } from '@angular/core/testing';

import { AuditoriasService } from './auditorias.service';

describe('AuditoriasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditoriasService]
    });
  });

  it('should be created', inject([AuditoriasService], (service: AuditoriasService) => {
    expect(service).toBeTruthy();
  }));
});