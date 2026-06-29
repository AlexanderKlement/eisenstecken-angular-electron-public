import { ComponentFixture, TestBed } from "@angular/core/testing";
import OfferV2PreviewDialogComponent from "./offer-v2-preview-dialog.component";

describe("OfferFieldsEditDialogComponent", () => {
  let component: OfferV2PreviewDialogComponent;
  let fixture: ComponentFixture<OfferV2PreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferV2PreviewDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferV2PreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
