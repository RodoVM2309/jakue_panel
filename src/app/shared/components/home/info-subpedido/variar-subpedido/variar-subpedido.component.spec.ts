import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariarSubpedidoComponent } from './variar-subpedido.component';

describe('VariarSubpedidoComponent', () => {
  let component: VariarSubpedidoComponent;
  let fixture: ComponentFixture<VariarSubpedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariarSubpedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariarSubpedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
