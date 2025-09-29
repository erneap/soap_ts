import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEditorParagraphGraphic } from './help-editor-paragraph-graphic';

describe('HelpEditorParagraphGraphic', () => {
  let component: HelpEditorParagraphGraphic;
  let fixture: ComponentFixture<HelpEditorParagraphGraphic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpEditorParagraphGraphic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpEditorParagraphGraphic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
