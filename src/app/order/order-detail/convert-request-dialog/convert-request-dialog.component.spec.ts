import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertRequestDialogComponent } from './convert-request-dialog.component';

describe('ConvertRequestDialogComponent', () => {
  let component: ConvertRequestDialogComponent;
  let fixture: ComponentFixture<ConvertRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertRequestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
