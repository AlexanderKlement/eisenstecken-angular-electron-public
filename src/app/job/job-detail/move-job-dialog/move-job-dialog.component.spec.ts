import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveJobDialogComponent } from './move-job-dialog.component';

describe('ChangePathDialogComponent', () => {
  let component: MoveJobDialogComponent;
  let fixture: ComponentFixture<MoveJobDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MoveJobDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveJobDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
