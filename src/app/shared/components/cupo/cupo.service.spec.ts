import { TestBed, inject } from '@angular/core/testing';

import { CupoService } from './cupo.service';

describe('CupoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CupoService]
    });
  });

  it('should be created', inject([CupoService], (service: CupoService) => {
    expect(service).toBeTruthy();
  }));
});
