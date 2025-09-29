import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEntries } from './user-entries';

describe('UserEntries', () => {
  let component: UserEntries;
  let fixture: ComponentFixture<UserEntries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEntries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEntries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
