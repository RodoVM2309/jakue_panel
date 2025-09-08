import { TestBed, inject } from '@angular/core/testing';

import { CentrosService } from './centros.service';

describe('CentrosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CentrosService]
    });
  });

  it('should be created', inject([CentrosService], (service: CentrosService) => {
    expect(service).toBeTruthy();
  }));
});
