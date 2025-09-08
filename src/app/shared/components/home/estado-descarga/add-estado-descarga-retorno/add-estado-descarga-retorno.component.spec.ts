import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEstadoDescargaRetornoComponent } from './add-estado-descarga-retorno.component';

describe('AddEstadoDescargaComponent', () => {
  let component: AddEstadoDescargaRetornoComponent;
  let fixture: ComponentFixture<AddEstadoDescargaRetornoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEstadoDescargaRetornoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEstadoDescargaRetornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
