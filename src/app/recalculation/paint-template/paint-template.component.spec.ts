import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintTemplateComponent } from './paint-template.component';

describe('PaintTemplateComponent', () => {
  let component: PaintTemplateComponent;
  let fixture: ComponentFixture<PaintTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PaintTemplateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
