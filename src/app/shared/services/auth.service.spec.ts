import { TestBed } from "@angular/core/testing";

import { AuthStateService } from "./auth-state.service";
import { DefaultService } from "../../../api/openapi";

describe("AuthService", () => {
  let service: AuthStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    TestBed.inject<DefaultService>(DefaultService);
    service = TestBed.inject(AuthStateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
