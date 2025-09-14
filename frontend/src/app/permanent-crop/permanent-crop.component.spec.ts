import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermanentCropComponent } from './permanent-crop.component';

describe('PermanentCropComponent', () => {
  let component: PermanentCropComponent;
  let fixture: ComponentFixture<PermanentCropComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermanentCropComponent],
    });
    fixture = TestBed.createComponent(PermanentCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
