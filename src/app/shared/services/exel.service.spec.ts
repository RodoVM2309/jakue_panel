import { TestBed, inject } from '@angular/core/testing';

import { ExelService } from './exel.service';

describe('ExelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExelService]
    });
  });

  it('should be created', inject([ExelService], (service: ExelService) => {
    expect(service).toBeTruthy();
  }));
});
