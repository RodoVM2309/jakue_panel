import { TestBed, inject } from '@angular/core/testing';

import { FireserviService } from './fireservi.service';

describe('FireserviService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FireserviService]
    });
  });

  it('should be created', inject([FireserviService], (service: FireserviService) => {
    expect(service).toBeTruthy();
  }));
});
