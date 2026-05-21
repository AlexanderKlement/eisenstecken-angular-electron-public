import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TimeEntryEditDialogComponent } from "./time-entry-edit-dialog.component";

describe("TimeEntryEditDialogComponent", () => {
  let component: TimeEntryEditDialogComponent;
  let fixture: ComponentFixture<TimeEntryEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeEntryEditDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeEntryEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
