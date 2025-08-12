import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanReadingComponent } from './plan-reading-component';

describe('PlanReadingComponent', () => {
  let component: PlanReadingComponent;
  let fixture: ComponentFixture<PlanReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanReadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
