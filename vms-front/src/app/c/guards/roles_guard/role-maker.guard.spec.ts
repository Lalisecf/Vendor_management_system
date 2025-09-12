import { TestBed } from '@angular/core/testing';

import { RoleMakerGuard } from './role-maker.guard';

describe('RoleMakerGuard', () => {
  let guard: RoleMakerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleMakerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
