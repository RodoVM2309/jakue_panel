import { TestBed, inject } from '@angular/core/testing';

import { CentroProductoService } from './centro-producto.service';

describe('CentroProductoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CentroProductoService]
    });
  });

  it('should be created', inject([CentroProductoService], (service: CentroProductoService) => {
    expect(service).toBeTruthy();
  }));
});
