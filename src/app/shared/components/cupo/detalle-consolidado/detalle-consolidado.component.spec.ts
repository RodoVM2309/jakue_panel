import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleConsolidadoComponent } from './detalle-consolidado.component';

describe('DetalleConsolidadoComponent', () => {
  let component: DetalleConsolidadoComponent;
  let fixture: ComponentFixture<DetalleConsolidadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleConsolidadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleConsolidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
