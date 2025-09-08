import { TestBed, inject } from '@angular/core/testing';

import { AppAtencionService } from './app-atencion.service';

describe('AppAtencionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppAtencionService]
    });
  });

  it('should be created', inject([AppAtencionService], (service: AppAtencionService) => {
    expect(service).toBeTruthy();
  }));
});
