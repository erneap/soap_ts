import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMenuDialog } from './plan-menu-dialog';

describe('PlanMenuDialog', () => {
  let component: PlanMenuDialog;
  let fixture: ComponentFixture<PlanMenuDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanMenuDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanMenuDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
