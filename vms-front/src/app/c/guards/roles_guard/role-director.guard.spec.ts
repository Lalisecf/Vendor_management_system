import { TestBed } from '@angular/core/testing';

import { RoleDirectorGuard } from './role-director.guard';

describe('RoleDirectorGuard', () => {
  let guard: RoleDirectorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleDirectorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
