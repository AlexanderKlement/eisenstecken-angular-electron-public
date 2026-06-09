import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferLibraryEditComponent from "./offer-library-edit.component";

describe("OfferLibraryEditDialogComponent", () => {
  let component: OfferLibraryEditComponent;
  let fixture: ComponentFixture<OfferLibraryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferLibraryEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLibraryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
