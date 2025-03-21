import { TestBed } from '@angular/core/testing';

import { AttendanceMarkService } from './attendance-mark.service';

describe('AttendanceMarkService', () => {
  let service: AttendanceMarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceMarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
