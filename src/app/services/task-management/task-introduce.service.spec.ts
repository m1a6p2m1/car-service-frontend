import { TestBed } from '@angular/core/testing';

import { TaskIntroduceService } from './task-introduce.service';

describe('TaskIntroduceService', () => {
  let service: TaskIntroduceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskIntroduceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
