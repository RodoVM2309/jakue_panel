import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosViajesComponent } from './productos-viajes.component';

describe('ProductosViajesComponent', () => {
  let component: ProductosViajesComponent;
  let fixture: ComponentFixture<ProductosViajesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosViajesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosViajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
