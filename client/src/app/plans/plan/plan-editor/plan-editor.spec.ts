import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanEditor } from './plan-editor';

describe('PlanEditor', () => {
  let component: PlanEditor;
  let fixture: ComponentFixture<PlanEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
