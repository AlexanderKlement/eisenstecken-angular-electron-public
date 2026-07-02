import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StatementEntryFieldEditComponent } from "./statement-entry-field-edit.component";

describe("StatementEntryFieldEditComponent", () => {
  let component: StatementEntryFieldEditComponent;
  let fixture: ComponentFixture<StatementEntryFieldEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatementEntryFieldEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StatementEntryFieldEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
