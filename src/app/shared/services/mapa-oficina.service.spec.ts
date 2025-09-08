import { TestBed, inject } from '@angular/core/testing';

import { MapaOficinaService } from './mapa-oficina.service';

describe('MapaOficinaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapaOficinaService]
    });
  });

  it('should be created', inject([MapaOficinaService], (service: MapaOficinaService) => {
    expect(service).toBeTruthy();
  }));
});
