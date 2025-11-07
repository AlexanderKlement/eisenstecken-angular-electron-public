import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportXmlDialogComponent } from './import-xml-dialog.component';

describe('ImportXmlDialogComponent', () => {
  let component: ImportXmlDialogComponent;
  let fixture: ComponentFixture<ImportXmlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ImportXmlDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportXmlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
