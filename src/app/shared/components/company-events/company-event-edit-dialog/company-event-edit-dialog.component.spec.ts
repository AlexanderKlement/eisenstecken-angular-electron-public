import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEventEditDialogComponent } from './company-event-edit-dialog.component';

describe('CompanyEventEditDialogComponent', () => {
  let component: CompanyEventEditDialogComponent;
  let fixture: ComponentFixture<CompanyEventEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyEventEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyEventEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
