import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarPedidoRetornoComponent } from './confirmar-pedido-retorno.component';

describe('ConfirmarPedidoRetornoComponent', () => {
  let component: ConfirmarPedidoRetornoComponent;
  let fixture: ComponentFixture<ConfirmarPedidoRetornoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarPedidoRetornoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarPedidoRetornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
