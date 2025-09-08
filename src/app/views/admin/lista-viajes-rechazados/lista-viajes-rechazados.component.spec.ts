import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaViajesRechazadosComponent } from './lista-viajes-rechazados.component';

describe('ListaViajesRechazadosComponent', () => {
  let component: ListaViajesRechazadosComponent;
  let fixture: ComponentFixture<ListaViajesRechazadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaViajesRechazadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaViajesRechazadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
