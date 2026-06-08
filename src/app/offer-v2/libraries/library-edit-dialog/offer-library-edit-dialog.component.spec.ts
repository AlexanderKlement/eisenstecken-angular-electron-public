import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferLibraryEditDialogComponent from "./offer-library-edit-dialog.component";

describe("OfferLibraryEditDialogComponent", () => {
  let component: OfferLibraryEditDialogComponent;
  let fixture: ComponentFixture<OfferLibraryEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferLibraryEditDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLibraryEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
