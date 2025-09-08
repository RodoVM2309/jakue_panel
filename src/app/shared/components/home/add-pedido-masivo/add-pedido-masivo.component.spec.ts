import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPedidoMasivoComponent } from './add-pedido-masivo.component';

describe('AddPedidoMasivoComponent', () => {
  let component: AddPedidoMasivoComponent;
  let fixture: ComponentFixture<AddPedidoMasivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPedidoMasivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPedidoMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
