import { TestBed } from '@angular/core/testing';

import { SetAuthInterceptorService } from './set-auth-interceptor.service';

describe('SetAuthInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetAuthInterceptorService = TestBed.get(SetAuthInterceptorService);
    expect(service).toBeTruthy();
  });
});
