import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngoingDetailComponent } from './ingoing-detail.component';

describe('IngoingDetailComponent', () => {
  let component: IngoingDetailComponent;
  let fixture: ComponentFixture<IngoingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngoingDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngoingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
