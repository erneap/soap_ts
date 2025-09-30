import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEditor } from './help-editor';

describe('HelpEditor', () => {
  let component: HelpEditor;
  let fixture: ComponentFixture<HelpEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
