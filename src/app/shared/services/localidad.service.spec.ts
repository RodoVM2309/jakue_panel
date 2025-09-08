import { TestBed, inject } from '@angular/core/testing';

import { LocalidadService } from './localidad.service';

describe('LocalidadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalidadService]
    });
  });

  it('should be created', inject([LocalidadService], (service: LocalidadService) => {
    expect(service).toBeTruthy();
  }));
});
