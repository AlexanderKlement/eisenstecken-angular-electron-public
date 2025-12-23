import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Industry40CreateDialogComponent } from './industry-4-0-create-dialog.component';

describe('Industry40CreateDialogComponent', () => {
  let component: Industry40CreateDialogComponent;
  let fixture: ComponentFixture<Industry40CreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Industry40CreateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Industry40CreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
