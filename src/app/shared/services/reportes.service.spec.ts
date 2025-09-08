import { TestBed, inject } from '@angular/core/testing';

import { ReportesService } from './reportes.service';

describe('ReportesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportesService]
    });
  });

  it('should be created', inject([ReportesService], (service: ReportesService) => {
    expect(service).toBeTruthy();
  }));
});
