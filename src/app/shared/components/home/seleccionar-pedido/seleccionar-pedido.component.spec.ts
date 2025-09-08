import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarPedidoComponent } from './seleccionar-pedido.component';

describe('SeleccionarPedidoComponent', () => {
  let component: SeleccionarPedidoComponent;
  let fixture: ComponentFixture<SeleccionarPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
