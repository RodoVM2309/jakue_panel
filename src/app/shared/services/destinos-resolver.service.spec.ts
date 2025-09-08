import { TestBed, inject } from '@angular/core/testing';

import { DestinosResolverService } from './destinos-resolver.service';

describe('DestinosResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DestinosResolverService]
    });
  });

  it('should be created', inject([DestinosResolverService], (service: DestinosResolverService) => {
    expect(service).toBeTruthy();
  }));
});
