import { TestBed } from '@angular/core/testing';

import { RoleFinanceGuard } from './role-finance.guard';

describe('RoleFinanceGuard', () => {
  let guard: RoleFinanceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleFinanceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
