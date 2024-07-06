import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDashboardControlComponent } from './course-dashboard-control.component';

describe('CourseDashboardControlComponent', () => {
  let component: CourseDashboardControlComponent;
  let fixture: ComponentFixture<CourseDashboardControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDashboardControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseDashboardControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
