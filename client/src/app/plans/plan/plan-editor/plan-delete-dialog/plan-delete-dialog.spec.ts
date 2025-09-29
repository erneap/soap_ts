import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDeleteDialog } from './plan-delete-dialog';

describe('PlanDeleteDialog', () => {
  let component: PlanDeleteDialog;
  let fixture: ComponentFixture<PlanDeleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanDeleteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanDeleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
