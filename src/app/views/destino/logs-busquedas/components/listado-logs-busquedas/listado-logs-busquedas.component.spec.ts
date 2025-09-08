import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoLogsBusquedasComponent } from './listado-logs-busquedas.component';

describe('ListadoLogsBusquedasComponent', () => {
  let component: ListadoLogsBusquedasComponent;
  let fixture: ComponentFixture<ListadoLogsBusquedasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoLogsBusquedasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoLogsBusquedasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
