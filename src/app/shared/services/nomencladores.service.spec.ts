
import { TestBed, inject } from '@angular/core/testing';

import { NomencladoresService } from './nomencladores.service';

describe('NomencladoresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NomencladoresService]
    });
  });

  it('should be created', inject([NomencladoresService], (service: NomencladoresService) => {
    expect(service).toBeTruthy();
  }));
});
