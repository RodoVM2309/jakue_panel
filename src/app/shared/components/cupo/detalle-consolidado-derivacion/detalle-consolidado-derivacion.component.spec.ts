/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DetalleConsolidadoDerivacionComponent } from './detalle-consolidado-derivacion.component';

describe('DetalleConsolidadoDerivacionComponent', () => {
  let component: DetalleConsolidadoDerivacionComponent;
  let fixture: ComponentFixture<DetalleConsolidadoDerivacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleConsolidadoDerivacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleConsolidadoDerivacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
