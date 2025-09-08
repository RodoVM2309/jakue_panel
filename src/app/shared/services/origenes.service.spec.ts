import { TestBed, inject } from '@angular/core/testing';

import { OrigenesService } from './origenes.service';

describe('OrigenesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrigenesService]
    });
  });

  it('should be created', inject([OrigenesService], (service: OrigenesService) => {
    expect(service).toBeTruthy();
  }));
});
