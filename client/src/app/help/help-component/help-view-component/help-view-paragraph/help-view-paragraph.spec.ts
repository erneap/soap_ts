import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpViewParagraph } from './help-view-paragraph';

describe('HelpViewParagraph', () => {
  let component: HelpViewParagraph;
  let fixture: ComponentFixture<HelpViewParagraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpViewParagraph]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpViewParagraph);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
