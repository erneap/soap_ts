import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanNode } from './plan-node';

describe('PlanNode', () => {
  let component: PlanNode;
  let fixture: ComponentFixture<PlanNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
