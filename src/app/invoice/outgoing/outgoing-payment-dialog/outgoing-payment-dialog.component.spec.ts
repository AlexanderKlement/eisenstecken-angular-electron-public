import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingPaymentDialogComponent } from './outgoing-payment-dialog.component';

describe('OutgoingPaymentDialogComponent', () => {
  let component: OutgoingPaymentDialogComponent;
  let fixture: ComponentFixture<OutgoingPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingPaymentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingPaymentDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
