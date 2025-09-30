import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDayComponent } from './plan-day-component';

describe('PlanDayComponent', () => {
  let component: PlanDayComponent;
  let fixture: ComponentFixture<PlanDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
