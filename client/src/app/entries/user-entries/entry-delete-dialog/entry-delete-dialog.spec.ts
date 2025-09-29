import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDeleteDialog } from './entry-delete-dialog';

describe('EntryDeleteDialog', () => {
  let component: EntryDeleteDialog;
  let fixture: ComponentFixture<EntryDeleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryDeleteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryDeleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
