/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PanelConsolidadoPedidoComponent } from './panel-consolidado-pedido.component';

describe('PanelConsolidadoPedidoComponent', () => {
  let component: PanelConsolidadoPedidoComponent;
  let fixture: ComponentFixture<PanelConsolidadoPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelConsolidadoPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConsolidadoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
