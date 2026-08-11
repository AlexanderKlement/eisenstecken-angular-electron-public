import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferLibrariesComponent from "./offer-libraries.component";

describe("OfferLibrariesComponent", () => {
  let component: OfferLibrariesComponent;
  let fixture: ComponentFixture<OfferLibrariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferLibrariesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLibrariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
