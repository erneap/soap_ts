import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEditorParagraph } from './help-editor-paragraph';

describe('HelpEditorParagraph', () => {
  let component: HelpEditorParagraph;
  let fixture: ComponentFixture<HelpEditorParagraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpEditorParagraph]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpEditorParagraph);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
