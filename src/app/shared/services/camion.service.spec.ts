import { TestBed, inject } from '@angular/core/testing';

import { CamionService } from './camion.service';

describe('CamionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamionService]
    });
  });

  it('should be created', inject([CamionService], (service: CamionService) => {
    expect(service).toBeTruthy();
  }));
});
