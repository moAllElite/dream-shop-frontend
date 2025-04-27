import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageListItemComponent } from './product-image-list-item.component';

describe('ProductImageListItemComponent', () => {
  let component: ProductImageListItemComponent;
  let fixture: ComponentFixture<ProductImageListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductImageListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductImageListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
