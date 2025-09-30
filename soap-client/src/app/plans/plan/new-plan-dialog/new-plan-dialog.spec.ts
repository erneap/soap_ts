import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlanDialog } from './new-plan-dialog';

describe('NewPlanDialog', () => {
  let component: NewPlanDialog;
  let fixture: ComponentFixture<NewPlanDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPlanDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPlanDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
