import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPedidoRetornoComponent } from './add-pedido-retorno.component';

describe('AddPedidoRetornoComponent', () => {
  let component: AddPedidoRetornoComponent;
  let fixture: ComponentFixture<AddPedidoRetornoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPedidoRetornoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPedidoRetornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
