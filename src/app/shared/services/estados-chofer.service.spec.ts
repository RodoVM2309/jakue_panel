import { TestBed, inject } from '@angular/core/testing';

import { EstadosChoferService } from './estados-chofer.service';

describe('EstadosChoferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadosChoferService]
    });
  });

  it('should be created', inject([EstadosChoferService], (service: EstadosChoferService) => {
    expect(service).toBeTruthy();
  }));
});
