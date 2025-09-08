import { TestBed, inject } from '@angular/core/testing';

import { DestinatarioService } from './destinatario.service';

describe('DestinatarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DestinatarioService]
    });
  });

  it('should be created', inject([DestinatarioService], (service: DestinatarioService) => {
    expect(service).toBeTruthy();
  }));
});
