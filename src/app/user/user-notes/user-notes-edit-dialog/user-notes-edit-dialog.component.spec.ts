import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserNotesEditDialogComponent } from "./user-notes-edit-dialog.component";

describe("UserNotesEditDialogComponent", () => {
  let component: UserNotesEditDialogComponent;
  let fixture: ComponentFixture<UserNotesEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNotesEditDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotesEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
