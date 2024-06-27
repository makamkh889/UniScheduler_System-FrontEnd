import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsDashboardControlComponent } from './admins-dashboard-control.component';

describe('AdminsDashboardControlComponent', () => {
  let component: AdminsDashboardControlComponent;
  let fixture: ComponentFixture<AdminsDashboardControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminsDashboardControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminsDashboardControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
