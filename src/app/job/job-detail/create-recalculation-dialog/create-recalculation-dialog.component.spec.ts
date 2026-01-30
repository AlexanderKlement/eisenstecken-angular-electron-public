import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateRecalculationDialogComponent } from "./create-recalculation-dialog.component";

describe("CreateRecalculationDialogComponent", () => {
  let component: CreateRecalculationDialogComponent;
  let fixture: ComponentFixture<CreateRecalculationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRecalculationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRecalculationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
