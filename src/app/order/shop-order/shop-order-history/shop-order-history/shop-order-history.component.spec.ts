import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopOrderHistoryComponent } from './shop-order-history.component';

describe('ShopOrderHistoryComponent', () => {
  let component: ShopOrderHistoryComponent;
  let fixture: ComponentFixture<ShopOrderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopOrderHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopOrderHistoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
