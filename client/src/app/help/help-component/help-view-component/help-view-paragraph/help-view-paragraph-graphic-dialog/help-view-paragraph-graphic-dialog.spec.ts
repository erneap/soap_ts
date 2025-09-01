import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpViewParagraphGraphicDialog } from './help-view-paragraph-graphic-dialog';

describe('HelpViewParagraphGraphicDialog', () => {
  let component: HelpViewParagraphGraphicDialog;
  let fixture: ComponentFixture<HelpViewParagraphGraphicDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpViewParagraphGraphicDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpViewParagraphGraphicDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
