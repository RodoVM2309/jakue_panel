import { TestBed, inject } from '@angular/core/testing';

import { SituacionPuertoService } from './situacion-puerto.service';

describe('SituacionPuertoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SituacionPuertoService]
    });
  });

  it('should be created', inject([SituacionPuertoService], (service: SituacionPuertoService) => {
    expect(service).toBeTruthy();
  }));
});
