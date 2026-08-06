import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeByDateComponent } from './service-type-by-date.component';

describe('ServiceTypeByDateComponent', () => {
  let component: ServiceTypeByDateComponent;
  let fixture: ComponentFixture<ServiceTypeByDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTypeByDateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceTypeByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
