import { TestBed, inject } from '@angular/core/testing';

import { CcppService } from './ccpp.service';

describe('CcppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CcppService]
    });
  });

  it('should be created', inject([CcppService], (service: CcppService) => {
    expect(service).toBeTruthy();
  }));
});
