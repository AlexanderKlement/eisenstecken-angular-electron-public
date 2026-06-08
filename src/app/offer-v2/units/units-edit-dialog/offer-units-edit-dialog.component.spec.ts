import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferUnitsEditDialogComponent from "./offer-units-edit-dialog.component";

describe("OfferUnitsEditDialogComponent", () => {
  let component: OfferUnitsEditDialogComponent;
  let fixture: ComponentFixture<OfferUnitsEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferUnitsEditDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferUnitsEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
