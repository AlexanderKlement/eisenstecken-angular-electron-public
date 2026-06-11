import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateEntryEditComponent } from './template-entry-edit.component';

describe('TemplateEntryEditComponent', () => {
  let component: TemplateEntryEditComponent;
  let fixture: ComponentFixture<TemplateEntryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateEntryEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateEntryEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
