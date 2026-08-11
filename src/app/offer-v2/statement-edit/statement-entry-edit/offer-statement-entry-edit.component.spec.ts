import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OfferStatementEntryEditComponent } from "./offer-statement-entry-edit.component";

describe("OfferStatementEntryEditComponent", () => {
  let component: OfferStatementEntryEditComponent;
  let fixture: ComponentFixture<OfferStatementEntryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferStatementEntryEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OfferStatementEntryEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
