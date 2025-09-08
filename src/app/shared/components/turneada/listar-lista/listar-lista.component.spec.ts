import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarListaComponent } from './listar-lista.component';

describe('ListarListaComponent', () => {
  let component: ListarListaComponent;
  let fixture: ComponentFixture<ListarListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
