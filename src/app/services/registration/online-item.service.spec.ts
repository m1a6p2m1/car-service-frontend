import { TestBed } from '@angular/core/testing';

import { OnlineItemService } from './online-item.service';

describe('OnlineItemService', () => {
  let service: OnlineItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
