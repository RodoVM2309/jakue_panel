import { TestBed, inject } from '@angular/core/testing';

import { SendsmsService } from './sendsms.service';

describe('SendsmsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SendsmsService]
    });
  });

  it('should be created', inject([SendsmsService], (service: SendsmsService) => {
    expect(service).toBeTruthy();
  }));
});
