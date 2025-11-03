import { TestBed } from '@angular/core/testing';

import { BackStackService } from './back-stack.service';

describe('BackStackService', () => {
  let service: BackStackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackStackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
