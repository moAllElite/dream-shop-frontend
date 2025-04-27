import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderRangePriceComponent } from './slider-range-price.component';

describe('SliderRangePriceComponent', () => {
  let component: SliderRangePriceComponent;
  let fixture: ComponentFixture<SliderRangePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderRangePriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderRangePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
