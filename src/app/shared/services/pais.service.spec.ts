import { TestBed, inject } from '@angular/core/testing';

import { PaisService } from './pais.service';

describe('PaisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaisService]
    });
  });

  it('should be created', inject([PaisService], (service: PaisService) => {
    expect(service).toBeTruthy();
  }));
});
