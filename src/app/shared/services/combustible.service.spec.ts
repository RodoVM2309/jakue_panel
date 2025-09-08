import { TestBed, inject } from '@angular/core/testing';

import { CombustibleService } from './combustible.service';

describe('CombustibleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CombustibleService]
    });
  });

  it('should be created', inject([CombustibleService], (service: CombustibleService) => {
    expect(service).toBeTruthy();
  }));
});
