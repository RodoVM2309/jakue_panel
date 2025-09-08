import { TestBed, inject } from '@angular/core/testing';

import { AcopladosService } from './acoplados.service';

describe('AcopladosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcopladosService]
    });
  });

  it('should be created', inject([AcopladosService], (service: AcopladosService) => {
    expect(service).toBeTruthy();
  }));
});
