import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CupoPedidoComponent } from './cupo-pedido.component';

describe('CupoPedidoComponent', () => {
  let component: CupoPedidoComponent;
  let fixture: ComponentFixture<CupoPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CupoPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CupoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
