import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEditorList } from './help-editor-list';

describe('HelpEditorList', () => {
  let component: HelpEditorList;
  let fixture: ComponentFixture<HelpEditorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpEditorList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpEditorList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
