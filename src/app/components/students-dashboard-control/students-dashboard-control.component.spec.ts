import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsDashboardControlComponent } from './students-dashboard-control.component';

describe('StudentsDashboardControlComponent', () => {
  let component: StudentsDashboardControlComponent;
  let fixture: ComponentFixture<StudentsDashboardControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsDashboardControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsDashboardControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
