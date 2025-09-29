import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryList } from './entry-list';

describe('EntryList', () => {
  let component: EntryList;
  let fixture: ComponentFixture<EntryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
