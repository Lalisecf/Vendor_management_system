import { TestBed } from '@angular/core/testing';

import { RoleChiefGuard } from './role-chief.guard';

describe('RoleChiefGuard', () => {
  let guard: RoleChiefGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleChiefGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
