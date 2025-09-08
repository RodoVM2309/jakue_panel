import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaChoferesEstadosComponent } from './lista-choferes-estados.component';

describe('ListaChoferesEstadosComponent', () => {
  let component: ListaChoferesEstadosComponent;
  let fixture: ComponentFixture<ListaChoferesEstadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaChoferesEstadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaChoferesEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
