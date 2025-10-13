import { TestBed } from '@angular/core/testing';

import { Middle } from './middle';

describe('Middle', () => {
  let service: Middle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Middle);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
