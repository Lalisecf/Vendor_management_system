import { TestBed } from '@angular/core/testing';

import { RoleShareGuard } from './role-share.guard';

describe('RoleShareGuard', () => {
  let guard: RoleShareGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleShareGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
