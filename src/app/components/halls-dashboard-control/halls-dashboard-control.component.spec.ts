import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallsDashboardControlComponent } from './halls-dashboard-control.component';

describe('HallsDashboardControlComponent', () => {
  let component: HallsDashboardControlComponent;
  let fixture: ComponentFixture<HallsDashboardControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallsDashboardControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HallsDashboardControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
