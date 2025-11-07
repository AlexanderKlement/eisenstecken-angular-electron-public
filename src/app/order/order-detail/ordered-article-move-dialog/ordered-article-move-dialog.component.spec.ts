import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedArticleMoveDialogComponent } from './ordered-article-move-dialog.component';

describe('OrderedArticleMoveDialogComponent', () => {
  let component: OrderedArticleMoveDialogComponent;
  let fixture: ComponentFixture<OrderedArticleMoveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OrderedArticleMoveDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderedArticleMoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
