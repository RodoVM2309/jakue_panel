/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TransportadoraService } from './transportadora.service';

describe('Service: Transportadora', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransportadoraService]
    });
  });

  it('should ...', inject([TransportadoraService], (service: TransportadoraService) => {
    expect(service).toBeTruthy();
  }));
});
