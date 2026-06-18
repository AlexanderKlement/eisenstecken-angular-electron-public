import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferLibraryEntrySelectorComponent from "./offer-library-entry-selector.component";

describe("OfferLibraryEntrySelectorComponent", () => {
  let component: OfferLibraryEntrySelectorComponent;
  let fixture: ComponentFixture<OfferLibraryEntrySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferLibraryEntrySelectorComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLibraryEntrySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
