import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEditorGraphicDialog } from './help-editor-graphic-dialog';

describe('HelpEditorGraphicDialog', () => {
  let component: HelpEditorGraphicDialog;
  let fixture: ComponentFixture<HelpEditorGraphicDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpEditorGraphicDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpEditorGraphicDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
