import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPageSettingEditDialogComponent } from './info-page-setting-edit-dialog.component';

describe('InfoPageSettingEditDialogComponent', () => {
  let component: InfoPageSettingEditDialogComponent;
  let fixture: ComponentFixture<InfoPageSettingEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfoPageSettingEditDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPageSettingEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
