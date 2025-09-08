import { TestBed, inject } from '@angular/core/testing';

import { ZonaChoferesLibresService } from './zona-choferes-libres.service';

describe('ZonaChoferesLibresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZonaChoferesLibresService]
    });
  });

  it('should be created', inject([ZonaChoferesLibresService], (service: ZonaChoferesLibresService) => {
    expect(service).toBeTruthy();
  }));
});
