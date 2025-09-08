import { TestBed, inject } from '@angular/core/testing';

import { PedidoResolverService } from './pedido-resolver.service';

describe('PedidoResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PedidoResolverService]
    });
  });

  it('should be created', inject([PedidoResolverService], (service: PedidoResolverService) => {
    expect(service).toBeTruthy();
  }));
});
