import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEditorParagraphBullet } from './help-editor-paragraph-bullet';

describe('HelpEditorParagraphBullet', () => {
  let component: HelpEditorParagraphBullet;
  let fixture: ComponentFixture<HelpEditorParagraphBullet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpEditorParagraphBullet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpEditorParagraphBullet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
