import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarBusquedaComponent } from './gestionar-busqueda.component';

describe('GestionarBusquedaComponent', () => {
  let component: GestionarBusquedaComponent;
  let fixture: ComponentFixture<GestionarBusquedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarBusquedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
