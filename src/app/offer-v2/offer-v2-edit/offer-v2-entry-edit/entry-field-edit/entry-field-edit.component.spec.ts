import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryFieldEditComponent } from './entry-field-edit.component';

describe('EntryFieldEditComponent', () => {
  let component: EntryFieldEditComponent;
  let fixture: ComponentFixture<EntryFieldEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryFieldEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryFieldEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
