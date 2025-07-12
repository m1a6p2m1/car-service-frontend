import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTrackerComponent } from './task-tracker.component';

describe('TaskTrackerComponent', () => {
  let component: TaskTrackerComponent;
  let fixture: ComponentFixture<TaskTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskTrackerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
