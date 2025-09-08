import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoRechazadosComponent } from './listado-rechazados.component';

describe('ListadoRechazadosComponent', () => {
  let component: ListadoRechazadosComponent;
  let fixture: ComponentFixture<ListadoRechazadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoRechazadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoRechazadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
