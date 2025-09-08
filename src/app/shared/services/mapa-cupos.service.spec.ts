import { TestBed, inject } from '@angular/core/testing';

import { MapaCuposService } from './mapa-cupos.service';

describe('MapaCuposService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapaCuposService]
    });
  });

  it('should be created', inject([MapaCuposService], (service: MapaCuposService) => {
    expect(service).toBeTruthy();
  }));
});
