import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaChoferesObservacionesComponent } from './lista-choferes-observaciones.component';

describe('ListaChoferesObservacionesComponent', () => {
  let component: ListaChoferesObservacionesComponent;
  let fixture: ComponentFixture<ListaChoferesObservacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaChoferesObservacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaChoferesObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
