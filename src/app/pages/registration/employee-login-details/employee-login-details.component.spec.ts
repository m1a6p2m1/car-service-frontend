import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLoginDetailsComponent } from './employee-login-details.component';

describe('EmployeeLoginDetailsComponent', () => {
  let component: EmployeeLoginDetailsComponent;
  let fixture: ComponentFixture<EmployeeLoginDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeLoginDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeLoginDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
