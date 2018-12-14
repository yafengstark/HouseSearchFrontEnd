import { TestBed } from '@angular/core/testing';

import { AppTempService } from './app-temp.service';

describe('AppTempService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppTempService = TestBed.get(AppTempService);
    expect(service).toBeTruthy();
  });
});
