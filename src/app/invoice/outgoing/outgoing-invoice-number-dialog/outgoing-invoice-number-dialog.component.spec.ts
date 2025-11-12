import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingInvoiceNumberDialogComponent } from './outgoing-invoice-number-dialog.component';

describe('OutgoingInvoiceNumberDialogComponent', () => {
  let component: OutgoingInvoiceNumberDialogComponent;
  let fixture: ComponentFixture<OutgoingInvoiceNumberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OutgoingInvoiceNumberDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingInvoiceNumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
