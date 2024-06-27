import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDashboardControlComponent } from './doctor-dashboard-control.component';

describe('DoctorDashboardControlComponent', () => {
  let component: DoctorDashboardControlComponent;
  let fixture: ComponentFixture<DoctorDashboardControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorDashboardControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorDashboardControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
