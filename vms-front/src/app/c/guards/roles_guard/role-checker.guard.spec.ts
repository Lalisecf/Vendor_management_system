import { TestBed } from '@angular/core/testing';

import { RoleCheckerGuard } from './role-checker.guard';

describe('RoleCheckerGuard', () => {
  let guard: RoleCheckerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleCheckerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
