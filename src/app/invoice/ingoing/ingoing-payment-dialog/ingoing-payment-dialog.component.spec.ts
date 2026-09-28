import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngoingPaymentDialogComponent } from './ingoing-payment-dialog.component';

describe('IngoingPaymentDialogComponent', () => {
  let component: IngoingPaymentDialogComponent;
  let fixture: ComponentFixture<IngoingPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngoingPaymentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngoingPaymentDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
