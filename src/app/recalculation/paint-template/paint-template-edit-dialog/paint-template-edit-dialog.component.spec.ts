import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintTemplateEditDialogComponent } from './paint-template-edit-dialog.component';

describe('PaintTemplateEditDialogComponent', () => {
  let component: PaintTemplateEditDialogComponent;
  let fixture: ComponentFixture<PaintTemplateEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaintTemplateEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintTemplateEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
