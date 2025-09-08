import { TestBed, inject } from '@angular/core/testing';

import { MarketingService } from './marketing.service';

describe('MarketingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketingService]
    });
  });

  it('should be created', inject([MarketingService], (service: MarketingService) => {
    expect(service).toBeTruthy();
  }));
});
