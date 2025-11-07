import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePathDialogComponent } from './change-path-dialog.component';

describe('ChangePathDialogComponent', () => {
  let component: ChangePathDialogComponent;
  let fixture: ComponentFixture<ChangePathDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ChangePathDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePathDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
