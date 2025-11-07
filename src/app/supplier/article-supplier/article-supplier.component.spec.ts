import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSupplierComponent } from './article-supplier.component';

describe('ArticleSupplierComponent', () => {
  let component: ArticleSupplierComponent;
  let fixture: ComponentFixture<ArticleSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ArticleSupplierComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
