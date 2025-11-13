import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleIconButtonComponent } from './circle-icon-button.component';

describe('CircleIconButtonComponent', () => {
  let component: CircleIconButtonComponent;
  let fixture: ComponentFixture<CircleIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleIconButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
