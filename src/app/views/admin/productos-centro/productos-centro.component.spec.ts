import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosCentroComponent } from './productos-centro.component';

describe('ProductosCentroComponent', () => {
  let component: ProductosCentroComponent;
  let fixture: ComponentFixture<ProductosCentroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosCentroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
