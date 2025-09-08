import { TestBed, inject } from '@angular/core/testing';

import { LogsBusquedaService } from './logs-busqueda.service';

describe('LogsBusquedaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogsBusquedaService]
    });
  });

  it('should be created', inject([LogsBusquedaService], (service: LogsBusquedaService) => {
    expect(service).toBeTruthy();
  }));
});
