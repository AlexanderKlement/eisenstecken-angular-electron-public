import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferFieldsEditDialogComponent from "./offer-fields-edit-dialog.component";

describe("OfferFieldsEditDialogComponent", () => {
  let component: OfferFieldsEditDialogComponent;
  let fixture: ComponentFixture<OfferFieldsEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFieldsEditDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferFieldsEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
