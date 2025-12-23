import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Industry40Component } from "./industry-4-0.component";

describe("Industry40Component", () => {
  let component: Industry40Component;
  let fixture: ComponentFixture<Industry40Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Industry40Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Industry40Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
