import { TestBed, inject } from '@angular/core/testing';

import { MagypService } from './magyp.service';

describe('MagypService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MagypService]
    });
  });

  it('should be created', inject([MagypService], (service: MagypService) => {
    expect(service).toBeTruthy();
  }));
});
