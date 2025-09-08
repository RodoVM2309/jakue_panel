import { TestBed, inject } from '@angular/core/testing';

import { AppErrorService } from './app-error.service';

describe('AppErrorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppErrorService]
    });
  });

  it('should be created', inject([AppErrorService], (service: AppErrorService) => {
    expect(service).toBeTruthy();
  }));
});
