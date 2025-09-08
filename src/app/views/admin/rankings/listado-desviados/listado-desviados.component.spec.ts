import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDesviadosComponent } from './listado-desviados.component';

describe('ListadoDesviadosComponent', () => {
  let component: ListadoDesviadosComponent;
  let fixture: ComponentFixture<ListadoDesviadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoDesviadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDesviadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
