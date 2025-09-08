import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProductoZonaComponent } from './detalle-producto-zona.component';

describe('DetalleProductoZonaComponent', () => {
  let component: DetalleProductoZonaComponent;
  let fixture: ComponentFixture<DetalleProductoZonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleProductoZonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleProductoZonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
