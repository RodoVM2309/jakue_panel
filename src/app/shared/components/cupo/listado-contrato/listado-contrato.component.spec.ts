import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoContratoComponent } from './listado-contrato.component';

describe('ListadoContratoComponent', () => {
  let component: ListadoContratoComponent;
  let fixture: ComponentFixture<ListadoContratoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoContratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
