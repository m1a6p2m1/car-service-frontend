import { TestBed } from '@angular/core/testing';

import { AllTaskService } from './all-task.service';

describe('AllTaskService', () => {
  let service: AllTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
