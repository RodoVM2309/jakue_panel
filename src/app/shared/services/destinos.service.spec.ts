import { TestBed, inject } from '@angular/core/testing';

import { DestinosService } from './destinos.service';

describe('DestinosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DestinosService]
    });
  });

  it('should be created', inject([DestinosService], (service: DestinosService) => {
    expect(service).toBeTruthy();
  }));
});
