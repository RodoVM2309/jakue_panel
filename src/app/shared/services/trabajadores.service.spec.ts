import { TestBed, inject } from '@angular/core/testing';

import { TrabajadoresService } from './trabajadores.service';

describe('TrabajadoresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrabajadoresService]
    });
  });

  it('should be created', inject([TrabajadoresService], (service: TrabajadoresService) => {
    expect(service).toBeTruthy();
  }));
});
