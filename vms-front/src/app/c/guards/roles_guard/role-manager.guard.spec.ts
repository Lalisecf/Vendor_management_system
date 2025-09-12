import { TestBed } from '@angular/core/testing';

import { RoleManagerGuard } from './role-manager.guard';

describe('RoleManagerGuard', () => {
  let guard: RoleManagerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleManagerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
