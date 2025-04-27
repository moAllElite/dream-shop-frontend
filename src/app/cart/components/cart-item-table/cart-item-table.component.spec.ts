import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemTableComponent } from './cart-item-table.component';

describe('CartTableComponent', () => {
  let component: CartItemTableComponent;
  let fixture: ComponentFixture<CartItemTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
