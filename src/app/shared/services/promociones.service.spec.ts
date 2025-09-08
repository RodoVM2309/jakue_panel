import { TestBed, inject } from '@angular/core/testing';

import { PromocionesService } from './promociones.service';

describe('PromocionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromocionesService]
    });
  });

  it('should be created', inject([PromocionesService], (service: PromocionesService) => {
    expect(service).toBeTruthy();
  }));
});
