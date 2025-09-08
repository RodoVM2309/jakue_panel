import { TestBed, inject } from '@angular/core/testing';

import { TransporteChoferService } from './transporte-chofer.service';

describe('TransporteChofer.TsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransporteChoferService]
    });
  });

  it('should be created', inject([TransporteChoferService], (service: TransporteChoferService) => {
    expect(service).toBeTruthy();
  }));
});
