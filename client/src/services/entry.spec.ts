import { TestBed } from '@angular/core/testing';

import { Entry } from './entry';

describe('Entry', () => {
  let service: Entry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Entry);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
