import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageListComponent } from './image-list.component';

describe('ProductImageListComponent', () => {
  let component: ImageListComponent;
  let fixture: ComponentFixture<ImageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
