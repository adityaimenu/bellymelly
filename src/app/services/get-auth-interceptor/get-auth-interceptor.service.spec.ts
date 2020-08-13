import { TestBed } from '@angular/core/testing';

import { GetAuthInterceptorService } from './get-auth-interceptor.service';

describe('GetAuthInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetAuthInterceptorService = TestBed.get(GetAuthInterceptorService);
    expect(service).toBeTruthy();
  });
});
