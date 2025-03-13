import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageBottomSheetComponent } from './image-bottom-sheet.component';

describe('ImageBottomSheetComponent', () => {
  let component: ImageBottomSheetComponent;
  let fixture: ComponentFixture<ImageBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageBottomSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
