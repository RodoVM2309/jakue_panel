import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPedidoCortoComponent } from './add-pedido-corto.component';

describe('AddPedidoCortoComponent', () => {
  let component: AddPedidoCortoComponent;
  let fixture: ComponentFixture<AddPedidoCortoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPedidoCortoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPedidoCortoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
