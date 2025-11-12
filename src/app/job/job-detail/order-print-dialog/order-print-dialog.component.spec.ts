import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPrintDialogComponent } from './order-print-dialog.component';

describe('OrderPrintDialogComponent', () => {
  let component: OrderPrintDialogComponent;
  let fixture: ComponentFixture<OrderPrintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OrderPrintDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
