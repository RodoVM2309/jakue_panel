import { TestBed, inject } from '@angular/core/testing';

import { ListaNegraMotivosService } from './lista-negra-motivos.service';

describe('ListaNegraMotivosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListaNegraMotivosService]
    });
  });

  it('should be created', inject([ListaNegraMotivosService], (service: ListaNegraMotivosService) => {
    expect(service).toBeTruthy();
  }));
});
