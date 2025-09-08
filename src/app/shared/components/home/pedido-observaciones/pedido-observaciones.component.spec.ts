import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoObservacionesComponent } from './pedido-observaciones.component';

describe('PedidoObservacionesComponent', () => {
  let component: PedidoObservacionesComponent;
  let fixture: ComponentFixture<PedidoObservacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoObservacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
